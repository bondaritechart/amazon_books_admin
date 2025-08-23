import { CSSProperties } from 'react';

type Padding =
  | 'spacing0'
  | 'spacing4'
  | 'spacing8'
  | 'spacing12'
  | 'spacing16'
  | 'spacing20'
  | 'spacing24'
  | 'spacing32'
  | 'spacing40'
  | 'spacing48';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?:
    | Padding
    | [Padding, Padding]
    | [Padding, Padding, Padding]
    | [Padding, Padding, Padding, Padding];
  justify?: CSSProperties['justifyContent'];
  align?: CSSProperties['alignItems'];
  direction?: CSSProperties['flexDirection'];
  flex?: CSSProperties['flex'];
  cluster?: boolean;
  gap?: Padding;
  relative?: boolean;
  maxWidth?: number;
  style?: CSSProperties;
  className?: string;
}
export const Box = ({
  children,
  padding,
  justify,
  maxWidth,
  align,
  direction,
  cluster,
  gap,
  relative,
  flex,
  style,
  ...rest
}: BoxProps) => {
  const p = Array.isArray(padding)
    ? padding.map((p) => `var(--${[p]})`).join(' ')
    : `var(--${[padding as Padding]})`;
  const styles = {
    ...{
      display: 'flex',
      flexDirection: 'column' as CSSProperties['flexDirection'],
    },
    ...(padding ? { padding: p } : {}),
    ...(justify ? { justifyContent: justify } : {}),
    ...(align ? { alignItems: align } : {}),
    ...(maxWidth ? { maxWidth: `${maxWidth}rem` } : {}),
    ...(direction ? { flexDirection: direction } : {}),
    ...(flex ? { flex: flex } : {}),
    ...(relative ? { position: 'relative' as CSSProperties['position'] } : {}),
    ...(cluster
      ? {
          flexDirection: 'row' as CSSProperties['flexDirection'],
          flexWrap: 'wrap' as CSSProperties['flexWrap'],
          alignItems: 'flex-start',
        }
      : {}),
    ...(gap ? { gap: `var(--${[gap]})` } : {}),
    ...style,
  };

  return (
    <div style={styles} {...rest}>
      {children}
    </div>
  );
};
