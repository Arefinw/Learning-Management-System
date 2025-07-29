
/**
 * @fileoverview Ant Design theme configuration for the application.
 * @description This file contains the theme configuration for Ant Design,
 * including the color palette, typography, and other design tokens.
 * @requires antd
 */

import { theme } from 'antd';

const { darkAlgorithm, compactAlgorithm } = theme;

export const customTheme = {
  token: {
    // Modern Color Palette
    colorPrimary: '#6A5ACD', // Vibrant modern color (SlateBlue)
    colorSecondary: '#f093fb', // Complementary accent color
    colorSuccess: '#52c41a', // Green for success
    colorWarning: '#faad14', // Yellow for warning
    colorError: '#f5222d', // Red for error
    colorInfo: '#1890ff', // Blue for info
    colorTextBase: '#333333',
    colorBgBase: '#f0f2f5',
    colorBgLayout: '#f0f2f5',
    colorBgContainer: '#ffffff',
    colorBorder: '#d9d9d9',

    // Typography System
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    fontSize: 14,
    lineHeight: 1.5715,

    // Spacing System (using Ant Design's built-in spacing)
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginLG: 24,
    marginXL: 32,
    marginXXL: 48,

    // Border Radius
    borderRadius: 8,

    // Box Shadow
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  components: {
    Layout: {
      headerBg: 'linear-gradient(to right, #667eea, #764ba2)',
      siderBg: '#ffffff',
    },
    Button: {
      primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
    },
    Card: {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      borderRadius: 12,
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: 'rgba(106, 90, 205, 0.1)',
      itemSelectedColor: '#6A5ACD',
    },
  },
  algorithm: [darkAlgorithm, compactAlgorithm],
};
