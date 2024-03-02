"use client";

import { Badge, Button, Label, Checkbox, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import { FiArrowDown } from "react-icons/fi";
import { TbEditCircleOff } from "react-icons/tb";
import { RxReset } from "react-icons/rx";
import { BsCopy } from "react-icons/bs";

import commentsList from "../comments/accy575-03-database.json";

interface IComment {
  comment: string;
  deduction: number;
}

const totalAvailablePoints = 80;

export default function Home() {
  const [addedComments, setAddedComments] = useState(
    Array(commentsList.length).fill(false)
  );
  const [generatedComment, setGeneratedComment] = useState("");
  const [editableComment, setEditableComment] = useState("");

  const toggleComment = (i: number) => {
    const newIndices = [...addedComments];
    newIndices[i] = !newIndices[i];
    setAddedComments(newIndices);
  };

  const resetSelections = () => {
    setAddedComments(Array(commentsList.length).fill(false));
    setEditableComment("");
    toast.success("Reset selections");
  };

  const getCommentString = (o: IComment) => {
    let newString = "";

    newString += `${o["comment"]}`;

    if (o["deduction"] > 0) {
      newString += ` (-${o["deduction"]} point${
        o["deduction"] == 1 ? "" : "s"
      })`;
    }

    newString += "\n";

    return newString;
  };

  const getDeductionBadge = (o: IComment) => {
    return o["deduction"] > 0 ? (
      <Badge color="failure" className="inline mr-2 xs">
        -{o["deduction"]} points
      </Badge>
    ) : (
      <Badge color="info" className="inline mr-2 xs">
        No deduction
      </Badge>
    );
  };

  const copyEditableCommentToClipboard = () => {
    copy(editableComment);
    toast.success("Copied text to clipboard");
  };

  useEffect(() => {
    let newString = "";
    let totalDeductions = 0;

    addedComments.forEach((isAdded, i) => {
      const o = commentsList[i];
      if (isAdded) {
        newString += `• ${getCommentString(o)}`;

        if (o["deduction"] > 0) {
          totalDeductions += o["deduction"];
        }
      }
    });

    newString += `\nTotal: ${
      totalAvailablePoints - totalDeductions
    } out of ${totalAvailablePoints} points`;

    setGeneratedComment(newString);
  }, [addedComments]);

  return (
    <main className="flex flex-row min-h-screen justify-between">
      <div className="flex-1 flex-col w-full h-screen overflow-y-scroll p-2 divide-y">
        {commentsList.map((o, commentIndex) => {
          const commentId = `comment-${commentIndex}`;
          return (
            <div key={commentId} className="flex py-1 items-center gap-2">
              <Checkbox
                id={commentId}
                checked={addedComments[commentIndex] === true}
                onChange={() => toggleComment(commentIndex)}
              />
              <Label htmlFor={commentId}>
                {getDeductionBadge(o)}
                {o["comment"]}
              </Label>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col w-full h-screen p-2 gap-y-2">
        <div className="relative">
          <Textarea
            rows={10}
            value={generatedComment}
            className="w-full"
            readOnly
          />

          <Badge
            icon={TbEditCircleOff}
            color="warning"
            className="absolute top-2 right-2"
          >
            Read Only
          </Badge>
        </div>

        <Button
          gradientDuoTone="purpleToBlue"
          className="w-full"
          onClick={() => setEditableComment(generatedComment)}
        >
          <FiArrowDown className="mr-3 h-4 w-4" />
          Clone and edit
        </Button>

        <Textarea
          value={editableComment}
          onChange={(e) => setEditableComment(e.target.value)}
          rows={10}
          className="w-full flex-1"
        />

        <Button.Group className="w-full" outline>
          <Button
            className="w-1/2"
            color="gray"
            onClick={() => copyEditableCommentToClipboard()}
          >
            <BsCopy className="mr-3 h-4 w-4" />
            Copy to clipboard
          </Button>

          <Button
            className="w-1/2"
            color="gray"
            onClick={() => resetSelections()}
          >
            <RxReset className="mr-3 h-4 w-4" />
            Reset
          </Button>
        </Button.Group>
      </div>

      <Toaster position="bottom-center" />
    </main>
  );
}
