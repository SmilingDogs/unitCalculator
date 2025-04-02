import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS } from '../utils/constants';
import { getUnitFullName } from '../utils/conversions';

interface UnitSelectorProps {
  label: string;
  value: string;
  unitOptions: string[];
  onSelect: (unit: string) => void;
  unitAbbreviation: string;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({
  label,
  value,
  unitOptions,
  onSelect,
  unitAbbreviation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleSelect = (unit: string) => {
    onSelect(unit);
    closeModal();
  };

  // Safe rendering of full unit name
  const renderUnitName = (unit: string) => {
    try {
      return getUnitFullName(unit);
    } catch (error) {
      return unit || 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorRow}>
        {/* Top row with unit selector dropdown */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={openModal} style={styles.unitNameContainer}>
            <Text style={styles.unitName}>
              {renderUnitName(unitOptions.find(u => u === label) || '')}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom row with values and unit abbreviation */}
        <View style={styles.bottomRow}>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value || '0'}</Text>
            <Text style={styles.unitAbbr}>{unitAbbreviation || ''}</Text>
          </View>
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Unit</Text>
              {unitOptions.length > 0 ? (
                <FlatList
                  data={unitOptions}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.unitOption, item === label && styles.selectedUnitOption]}
                      onPress={() => handleSelect(item)}>
                      <Text
                        style={[
                          styles.unitOptionText,
                          item === label && styles.selectedUnitOptionText,
                        ]}>
                        {renderUnitName(item)}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={styles.unitList}
                />
              ) : (
                <Text style={styles.noUnitsText}>No units available for this category</Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
    width: '100%',
  },
  selectorRow: {
    flexDirection: 'column',
    height: 125,
    borderWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderTopColor: COLORS.operationButtons,
    borderBottomColor: COLORS.operationButtons,
  },
  topRow: {
    flex: 1,
    paddingHorizontal: 10,
  },
  bottomRow: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  unitNameContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    width: '100%',
  },
  unitName: {
    color: COLORS.operationButtons,
    fontSize: 20,
    flex: 1,
    flexWrap: 'wrap',
  },
  dropdownArrow: {
    color: COLORS.operationButtons,
    fontSize: 14,
  },
  valueContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 32,
    color: 'white',
    textAlign: 'right',
    fontWeight: '500',
    flex: 0.75,
  },
  unitAbbr: {
    fontSize: 20,
    color: 'white',
    marginLeft: 8,
    flex: 0.25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.operationButtons,
    padding: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.operationButtons,
    marginBottom: 15,
    textAlign: 'center',
  },
  unitList: {
    maxHeight: '80%',
  },
  unitOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.regularButtons,
  },
  selectedUnitOption: {
    backgroundColor: COLORS.regularButtons,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.operationButtons,
  },
  unitOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedUnitOptionText: {
    color: COLORS.operationButtons,
    fontWeight: 'bold',
  },
  noUnitsText: {
    color: COLORS.text,
    textAlign: 'center',
    padding: 20,
  },
});

export default UnitSelector;
