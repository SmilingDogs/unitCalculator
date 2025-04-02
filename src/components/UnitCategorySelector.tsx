import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { COLORS, UNIT_CATEGORIES, UnitCategory } from '../utils/constants';

interface UnitCategorySelectorProps {
  selectedCategory: UnitCategory;
  onSelectCategory: (category: UnitCategory) => void;
}

const UnitCategorySelector: React.FC<UnitCategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  // Function to get the full category name
  const getCategoryDisplayName = (category: UnitCategory): string => {
    const categoryMap: Record<UnitCategory, string> = {
      area: 'Area',
      length: 'Length',
      temperature: 'Temp',
      volume: 'Volume',
      mass: 'Mass',
      speed: 'Speed',
      time: 'Time',
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {UNIT_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => onSelectCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}>
              {getCategoryDisplayName(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  scrollContainer: {
    paddingHorizontal: 5,
  },
  categoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 0,
    minWidth: 100,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.regularButtons,
    borderRadius: 10,
  },
  categoryText: {
    color: COLORS.text,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    flexShrink: 1,
  },
  selectedCategoryText: {
    color: COLORS.operationButtons,
  },
});

export default UnitCategorySelector;
