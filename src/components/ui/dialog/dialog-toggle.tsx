import { ReactElement, useState } from "react";

export interface DialogProps {
  isDialogOpen: boolean;
  toggleDialog: () => void;
}

interface DialogToggleProps {
  children: (props: DialogProps) => ReactElement;
}

function DialogToggle({ children }: DialogToggleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return children({
    isDialogOpen,
    toggleDialog,
  });
}

export default DialogToggle;
