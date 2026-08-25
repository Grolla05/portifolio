import { describe, it, expect } from 'vitest';
import {
  appleSpring,
  gentleSpring,
  bouncySpring,
  fadeUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  slideInLeft
} from '@/lib/animations/variants';

describe('Spring Physics & Animation Variants (Apple HIG)', () => {
  it('should define appleSpring with spring physics properties', () => {
    expect(appleSpring).toBeDefined();
    expect(appleSpring.type).toBe('spring');
    expect(appleSpring.stiffness).toBeGreaterThanOrEqual(300);
    expect(appleSpring.damping).toBeGreaterThanOrEqual(25);
  });

  it('should define gentleSpring with spring physics', () => {
    expect(gentleSpring).toBeDefined();
    expect(gentleSpring.type).toBe('spring');
  });

  it('should define bouncySpring with spring physics', () => {
    expect(bouncySpring).toBeDefined();
    expect(bouncySpring.type).toBe('spring');
  });

  it('should define fadeUp variant with hidden and visible states', () => {
    expect(fadeUp).toBeDefined();
    expect(fadeUp.hidden).toBeDefined();
    expect(fadeUp.visible).toBeDefined();
  });

  it('should define fadeIn variant', () => {
    expect(fadeIn).toBeDefined();
    expect(fadeIn.hidden).toBeDefined();
    expect(fadeIn.visible).toBeDefined();
  });

  it('should define scaleIn variant for squircle cards', () => {
    expect(scaleIn).toBeDefined();
    expect(scaleIn.hidden).toBeDefined();
    expect(scaleIn.visible).toBeDefined();
  });

  it('should define staggerContainer for fluid children reveals', () => {
    expect(staggerContainer).toBeDefined();
    expect(staggerContainer.visible).toBeDefined();
  });

  it('should define slideInLeft variant', () => {
    expect(slideInLeft).toBeDefined();
    expect(slideInLeft.hidden).toBeDefined();
    expect(slideInLeft.visible).toBeDefined();
  });
});
