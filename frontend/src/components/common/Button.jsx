import { Link } from "react-router-dom";

const variants = {
  primary: "btn-primary",
  gold: "btn-gold",
  outline: "btn-outline",
  light: "btn-outline-light",
};

/**
 * One button for every call to action.
 *  - pass `to` for an in-app route
 *  - pass `href` for an external link (opens in a new tab)
 *  - spread the result of getApplyTarget() / getVisitTarget() to send users to the right place
 */
export default function Button({ to, href, variant = "primary", size, icon: Icon, className = "", children, ...rest }) {
  const classes = `btn ${variants[variant] || variants.primary} ${size === "sm" ? "btn-sm" : ""} ${className}`;
  const content = (
    <>
      {Icon && <Icon size={19} aria-hidden="true" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (!href) {
    return (
      <button type="button" className={classes} {...rest}>
        {content}
      </button>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {content}
    </a>
  );
}
