"use client";
import { useAlertDialogStore } from "@/hooks/useAlertDialog";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog as AlertDialogPrimitive,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";

export function AlertDialog() {
  const {
    isOpen,
    title,
    description,
    confirmLabel,
    cancelLabel,
    isLoading,
    onConfirm,
    onCancel,
    closeDialog,
  } = useAlertDialogStore();


  const handleCancel = () => {
    onCancel();
    closeDialog();
  };

  return (
    <AlertDialogPrimitive open={isOpen} onOpenChange={closeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          <Button spinner onClick={onConfirm} disabled={isLoading}>
            {isLoading ? `${confirmLabel}...` : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
}
