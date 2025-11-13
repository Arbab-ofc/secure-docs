export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'
};


export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  xxl: `@media (min-width: ${breakpoints.xxl})`,

  
  xsDown: `@media (max-width: ${breakpoints.xs})`,
  smDown: `@media (max-width: ${breakpoints.sm})`,
  mdDown: `@media (max-width: ${breakpoints.md})`,
  lgDown: `@media (max-width: ${breakpoints.lg})`,
  xlDown: `@media (max-width: ${breakpoints.xl})`,

  
  smOnly: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
  mdOnly: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  lgOnly: `@media (min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`
};


export const getResponsiveValue = (values, breakpoint = 'md') => {
  if (typeof values === 'string' || typeof values === 'number') {
    return values;
  }

  return values[breakpoint] || values.md || values.sm || values.xs;
};

export default breakpoints;