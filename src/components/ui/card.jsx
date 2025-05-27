import * as React from "react";
import { cn } from "@/lib/utils";

function forwardRefWithAsChild(Component, defaultTag) {
  return React.forwardRef(({ asChild = false, className, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        className: cn(className, children.props.className),
        ...props,
      });
    }
    return React.createElement(
      Component || defaultTag,
      { ref, className, ...props },
      children
    );
  });
}

const Card = forwardRefWithAsChild("div");
Card.displayName = "Card";

const CardHeader = forwardRefWithAsChild("div");
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRefWithAsChild("h3");
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRefWithAsChild("p");
CardDescription.displayName = "CardDescription";

const CardContent = forwardRefWithAsChild("div");
CardContent.displayName = "CardContent";

const CardFooter = forwardRefWithAsChild("div");
CardFooter.displayName = "CardFooter";

// Now wrap with default Tailwind classes like before:

const cardClasses = "rounded-lg border bg-card text-card-foreground shadow-sm";
const cardHeaderClasses = "flex flex-col space-y-1.5 p-6";
const cardTitleClasses = "text-2xl font-semibold leading-none tracking-tight";
const cardDescriptionClasses = "text-sm text-muted-foreground";
const cardContentClasses = "p-6 pt-0";
const cardFooterClasses = "flex items-center p-6 pt-0";

const CardWithClasses = React.forwardRef(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(cardClasses, className)}
    {...props}
  />
));
CardWithClasses.displayName = "Card";

const CardHeaderWithClasses = React.forwardRef(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn(cardHeaderClasses, className)}
    {...props}
  />
));
CardHeaderWithClasses.displayName = "CardHeader";

const CardTitleWithClasses = React.forwardRef(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn(cardTitleClasses, className)}
    {...props}
  />
));
CardTitleWithClasses.displayName = "CardTitle";

const CardDescriptionWithClasses = React.forwardRef(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn(cardDescriptionClasses, className)}
    {...props}
  />
));
CardDescriptionWithClasses.displayName = "CardDescription";

const CardContentWithClasses = React.forwardRef(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn(cardContentClasses, className)}
    {...props}
  />
));
CardContentWithClasses.displayName = "CardContent";

const CardFooterWithClasses = React.forwardRef(({ className, ...props }, ref) => (
  <CardFooter
    ref={ref}
    className={cn(cardFooterClasses, className)}
    {...props}
  />
));
CardFooterWithClasses.displayName = "CardFooter";

export {
  CardWithClasses as Card,
  CardHeaderWithClasses as CardHeader,
  CardTitleWithClasses as CardTitle,
  CardDescriptionWithClasses as CardDescription,
  CardContentWithClasses as CardContent,
  CardFooterWithClasses as CardFooter,
};
