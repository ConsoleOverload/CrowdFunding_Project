function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {

  let variantClass = "";

  if (variant === "primary") {
    variantClass = "btn-primary";
  }

  else if (variant === "secondary") {
    variantClass = "btn-secondary";
  }

  else if (variant === "ghost") {
    variantClass = "btn-ghost";
  }

  return (

    <button
      disabled={disabled}
      className={`
        ${variantClass}
        ${className}
        disabled:opacity-60
        disabled:cursor-not-allowed
      `}
      {...props}
    >
      {children}
    </button>

  );
}

export default Button;