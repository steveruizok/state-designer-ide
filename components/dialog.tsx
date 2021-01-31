import * as Dialog from "@radix-ui/react-dialog"
import * as React from "react"

import CreateProjectDialog from "components/dialogs/create-project"
import DeleteProjectDialog from "components/dialogs/delete-project"
import DuplicateProjectDialog from "components/dialogs/duplicate-project"
import LoadingDialog from "components/dialogs/loading"
import RenameProjectDialog from "components/dialogs/rename-project"
import dialogState from "states/dialog"
import { styled } from "components/theme"
import { useStateDesigner } from "@state-designer/react"

interface DialogProps {}

export default function DialogManager({}: DialogProps) {
  const local = useStateDesigner(dialogState)

  if (local.isIn("closed")) return null

  return (
    <Dialog.Root
      open={!local.isIn("closed")}
      onOpenChange={(open) => !open && dialogState.send("CLOSED")}
    >
      <StyledOverlay />
      {local.whenIn<any>({
        renamingProject: <RenameProjectDialog />,
        deletingProject: <DeleteProjectDialog />,
        duplicatingProject: <DuplicateProjectDialog />,
        creatingProject: <CreateProjectDialog />,
        loadingProject: <LoadingDialog />,
        loading: <LoadingDialog />,
      })}
    </Dialog.Root>
  )
}

const StyledOverlay = styled(Dialog.Overlay, {
  backgroundColor: "rgba(0, 0, 0, .5)",
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})
