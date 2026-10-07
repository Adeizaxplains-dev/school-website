export default function Container({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag className={`container-page ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
