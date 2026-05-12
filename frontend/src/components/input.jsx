function Input({
  label,
  className = "",
  ...props
}) {

  return (

    <div>

      {label && (
        <label className="label">
          {label}
        </label>
      )}

      <input
        className={`input ${className}`}
        {...props}
      />

    </div>
  );
}

export default Input;