import { useState } from "react";
import { createChannel, uploadPFP } from "@/lib/Appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploader } from "react-drag-drop-files";
import { Channel } from "@/assets/types";
import { Loader2 } from "lucide-react";

const CreateChannel = ({ user }: any) => {
  const [username, setUsername] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handlePFP = (file: File) => {
    setFile(file);
  };

  const handleRemoveFile = () => {
    setFile(undefined);
  };

  const handleCreateChannel = async () => {
    if (username.length < 64 && username.length > 4) {
      if (file) {
        setLoader(true);
        const pfp: any = (await uploadPFP(file)) as any;
        const channel: Channel = (await createChannel(
          user.account.$id,
          username,
          pfp.$id
        )) as Channel;
        if (channel.$id) {
          window.location.href = "/channel/" + channel.$id;
        } else {
          setLoader(false);
          setError("Error creating channel");
        }
      } else {
        setError("Please upload a profile picture");
      }
    } else {
      setError("Username must be between 4 and 64 characters");
    }
  };

  return (
    <>
      {!loader ? (
        <div className="flex flex-col items-center justify-center w-2/3 gap-4 mt-12 h-fit">
          <div className="flex flex-col items-center justify-center w-3/5 aspect-square">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                className={`w-full h-full rounded-full aspect-square`}
                onClick={handleRemoveFile}
              />
            ) : (
              <FileUploader
                handleChange={handlePFP}
                name="file"
                types={["JPG", "JPEG", "PNG"]}
              />
            )}
          </div>
          {file && <p className="text-slate-600">*Click on image to remove*</p>}
          <div className="flex flex-col items-center justify-center w-full gap-2 h-fit">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={64}
              minLength={4}
              className="w-2/3"
            />
            <Button onClick={handleCreateChannel}>Create Channel</Button>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-black bg-opacity-50 w-dvw h-dvh">
          <Loader2 size={64} className="animate-spin" />
        </div>
      )}
    </>
  );
};

export default CreateChannel;
