import { Toaster as Sonner, toast } from "sonner"

const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#1A4D2E] group-[.toaster]:border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[#4A6B5A]",
          actionButton:
            "group-[.toast]:bg-[#FF6B00] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-200 group-[.toast]:text-gray-700",
        },
      }}
      {...props} />
  );
}

export { Toaster, toast }
