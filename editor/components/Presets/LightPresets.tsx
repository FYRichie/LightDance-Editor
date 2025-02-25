import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// mui
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
// states and actions
import { setCurrentStatus } from "core/actions";
// hooks
import useLightPresets from "./hooks/useLightPresets";
// redux states
import { selectLoad } from "slices/loadSlice";
// utils
import { getItem } from "core/utils";
// components
import PresetsList from "./PresetsList";
// types
import { ControlMapStatus } from "core/models";

/**
 * This is Presets component, list of status
 * @component
 */
export default function LightPresets() {
  // presets intialize
  // get loadedPresets or storagePresets
  const { lightPresets: loadedLightPresets } = useSelector(selectLoad);

  const {
    lightPresets,
    setLightPresets,
    addLightPresets,
    editLightPresetsName,
    deleteLightPresets,
  } = useLightPresets();

  useEffect(() => {
    if (getItem("lightPresets")) {
      setLightPresets(JSON.parse(getItem("lightPresets") || ""));
    } else {
      setLightPresets(loadedLightPresets);
    }
  }, []);

  // dialog
  const [open, setOpen] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const openDialog = () => setOpen(true);
  const closeDialog = () => {
    setOpen(false);
    setNameVal("");
  };
  const handleChangeName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNameVal(e.target.value);
  };

  // dispatch
  const handleAddPresets = (name: string) => {
    if (name.trim() !== "") addLightPresets(name);
    closeDialog();
  };
  const handleEditPresets = (name: string, idx: number) => {
    editLightPresetsName({ name, idx });
    closeDialog();
  };
  const handleDeletePresets = (idx: number) => {
    deleteLightPresets(idx);
  };
  const handleSetCurrentStatus = (status: ControlMapStatus) => {
    setCurrentStatus({ payload: status });
  };

  // short cut of key to save currentStatus
  return (
    <div>
      <div style={{ padding: 8 }}>
        <Button variant="outlined" size="small" onClick={openDialog}>
          Add
        </Button>
        <PresetsList
          presets={lightPresets}
          handleEditPresets={handleEditPresets}
          handleDeletePresets={handleDeletePresets}
          handleSetCurrent={handleSetCurrentStatus}
        />
      </div>
      <div>
        <Dialog fullWidth maxWidth="md" open={open} onClose={closeDialog}>
          <DialogTitle>Preset name</DialogTitle>
          <DialogContent>
            <TextField fullWidth value={nameVal} onChange={handleChangeName} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleAddPresets(nameVal)}>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
