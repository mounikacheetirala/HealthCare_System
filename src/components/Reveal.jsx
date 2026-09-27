import useInView from '../hooks/useInView';

/**
 * Fades + lifts its content in the first time it scrolls into view.
 *
 *   <Reveal className="section-head">…</Reveal>
 *   <Reveal className="grid grid-3" stagger>…cards…</Reveal>   // children cascade in
 *
 * Props:
 *   as       – element to render (default "div")
 *   stagger  – animate each direct child one after another instead of the wrapper
 *   delay    – extra delay in ms (wrapper mode)
 */
export default function Reveal({ as: Tag = 'div', stagger = false, delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();
  const classes = [stagger ? 'reveal-stagger' : 'reveal', inView ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ');
  const mergedStyle = delay ? { ...style, '--reveal-delay': `${delay}ms` } : style;

  return (
    <Tag ref={ref} className={classes} style={mergedStyle} {...rest}>
      {children}
    </Tag>
  );
}
