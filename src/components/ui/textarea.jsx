// import * as React from "react";

// const Textarea = React.forwardRef(({ className, ...props }, ref) => {
//   return <textarea ref={ref} className={className} {...props} />;
// });

// Textarea.displayName = "Textarea";

// export { Textarea };

import * as React from "react";

const MAX_LENGTH = 1000;

const Textarea = React.forwardRef(({ className, value, onChange, ...props }, ref) => {
  const [focused, setFocused] = React.useState(false);

  const charsLeft = MAX_LENGTH - (value?.length || 0);

  return (
    <div className="relative w-full">
      <textarea
        ref={ref}
        className={`
          block w-full min-h-[120px] max-h-[300px] resize-y
          rounded-md border border-gray-300 px-4 py-2
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          shadow-sm transition
          ${className || ""}
        `}
        maxLength={MAX_LENGTH}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      <div className="absolute bottom-1 right-2 text-xs text-gray-400 select-none">
        {charsLeft} characters left
      </div>
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
