import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const FadeWrapper = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, 
      useNativeDriver: true,
    }).start();

    return () => {

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, 
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FadeWrapper;
