import { useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Grid,
  Input,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { generateNameFile, getUrlStore, handleChangeFile } from "./handle";

const netWorks = [
  "applovin",
  "facebook",
  "google",
  "ironsource",
  "mintegral",
  "tiktok",
  "unity",
];

const Twisted = [
  {
    value: "1",
    label: "Twisted 1",
  },
  {
    value: "2",
    label: "Twisted 2",
  },
  {
    value: "3",
    label: "Both",
  }
]
const Localize = [
  {
    value: "",
    label: "None",
  },
  {
    value: "EN",
    label: "English",
  }
  ,{
    value: "JP",
    label: "Janpanese",
  },
  {
    value: "DE",
    label: "German",
  },
  {
    value: "TW",
    label: "Taiwan",
  },
  {
    value: "KR",
    label: "Korean",
  },
  {
    value: "ES",
    label: "Spanish",
  }
]
import JSZip from "jszip";

const addToZip = (zip: JSZip, blob: Blob, filename: string) => {
  zip.file(filename, blob);
};

const createAndZipBlob = (blob: Blob, filename: string, network: string) => {
  const zip = new JSZip();

  if (network == "facebook") {
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = (e) => {
      const textHtml = e.target?.result as string;
      const script =
        textHtml.match(
          /<script id="pf-game-script">([\s\S]+?)<\/script>/
        )?.[1] ?? "";
      const text = textHtml.replace(
        /<script id="pf-game-script">([\s\S]+?)<\/script>/,
        `<script src="index.js"></script>`
      );
      const newBlob = new Blob([text], { type: "text/html" });
      addToZip(zip, newBlob, "index.html");
      const blobScript = new Blob([script], { type: "text/javascript" });
      addToZip(zip, blobScript, "index.js");
      zip.generateAsync({ type: "blob" }).then(function (content) {
        const zipUrl = URL.createObjectURL(content);

        const a = document.createElement("a");
        a.href = zipUrl;
        a.download = filename + ".zip";
        document.body.appendChild(a);
        a.click();
      });
    };
  } else {
    addToZip(zip, blob, "index.html");
    if (network == "tiktok") {
      const text = `{"playable_orientation":0,"playable_languages":["ja","zh","ar","es","en","ko","pt","ru","vi"]}`;
      const jsonBlob = new Blob([text], { type: "application/json" });
      addToZip(zip, jsonBlob, "config.json");
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const zipUrl = URL.createObjectURL(content);

      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = filename + ".zip";
      document.body.appendChild(a);
      a.click();
    });
  }
};

const typeZip = ["mintegral", "google", "tiktok", "facebook"];

const linkAndroid1 = "https://play.google.com/store/apps/details?id=tangle.rope.tieknot.game3d.wood.master&hl=en";
const linkIOS1 = "https://apps.apple.com/us/app/tangle-rope-twisted-3d/id6467116170";
interface TypeDownload {
  e: any;
  linkAndroid: string;
  linkIOS: string;
  selectedNetwork: string;
  pa: string;
  idea: string;
  version: number;
  localize: string;
}
const downloadFile = (data: TypeDownload) => {
  const { e, linkAndroid, linkIOS, selectedNetwork, pa, idea, version, localize } = data;
  const newFile = handleChangeFile(
    selectedNetwork,
    e.target?.result as string,
    linkAndroid,
    linkIOS
  );
  const blob = new Blob([newFile], { type: "text/html" });
  const nameFile = generateNameFile({
    idea,
    PA: pa,
    network: selectedNetwork,
    version,
    localize
  });
  if (typeZip.includes(selectedNetwork)) {
    createAndZipBlob(blob, nameFile, selectedNetwork);
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nameFile}.html`;
  a.click();
};
function App() {
  const [selectedNetwork, setSelectedNetwork] = useState("applovin");
  const [linkAndroid, setLinkAndroid] = useState("");
  const [linkIOS, setLinkIOS] = useState("");
  const [idea, setIdea] = useState("");
  const [pa, setPa] = useState("");
  const [localize, setLocalize] = useState("");
  const [game, setGame] = useState("1");
  const [file, setFile] = useState<File | null>(null);
  const handleSubmit = () => {
    const reader = new FileReader();
    reader.readAsText(file as Blob);
    reader.onload = (e) => {
      const typeDownLoad : TypeDownload = {
        e,
        linkAndroid: "https://play.google.com/store/apps/details?id=tangle.rope.tieknot.game3d.wood.master&hl=en",
        linkIOS: "https://apps.apple.com/us/app/tangle-rope-twisted-3d/id6467116170",
        selectedNetwork,
        pa,
        idea,
        version: 1,
        localize,
      }
      if(game === "1") {
        downloadFile(typeDownLoad);
      }
      if(game === "2") {
        downloadFile({
          ...typeDownLoad, version: 2, linkAndroid: "https://play.google.com/store/apps/details?id=tangle.rope.tieknot.game3d.wood.master&hl=en", linkIOS: "https://apps.apple.com/ae/app/woody-untangle-rope-3d-puzzle/id6476656113"
        });
      }
      if(game === "3") {
        downloadFile(typeDownLoad);
        downloadFile({
          ...typeDownLoad, version: 2, linkAndroid: "https://play.google.com/store/apps/details?id=tangle.rope.tieknot.game3d.wood.master&hl=en", linkIOS: "https://apps.apple.com/ae/app/woody-untangle-rope-3d-puzzle/id6476656113"
        });
      }
    };
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            p: 4,
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box
            sx={{
              mb: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Typography variant="h6">Link Android:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    setLinkAndroid(e.target.value);
                  }}
                  value={linkAndroid}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Typography variant="h6">Link IOS:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  onChange={(e) => {
                    setLinkIOS(e.target.value);
                  }}
                  value={linkIOS}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid> */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Typography variant="h6">Idea:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  onChange={(e) => {
                    setIdea(e.target.value);
                  }}
                  value={idea}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Typography variant="h6">Phương án:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  onChange={(e) => {
                    setPa(e.target.value);
                  }}
                  value={pa}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Typography variant="h6">Localize:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Select
                  native
                  value={localize}
                  onChange={(e) => {
                    setLocalize(e.target.value);
                  }}
                  size="small"
                >
                  {Localize.map((local) => (
                    <option key={local.value} value={local.value}>
                      {local.label}
                    </option>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Typography variant="h6">Game:</Typography>
              </Grid>
              <Grid item xs={9}>
              <Select
                  native
                  value={game}
                  onChange={(e) => {
                    setGame(e.target.value);
                  }}
                  size="small"
                >
                  {Twisted.map((local) => (
                    <option key={local.value} value={local.value}>
                      {local.label}
                    </option>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <Select
              native
              value={selectedNetwork}
              onChange={(e) => {
                setSelectedNetwork(e.target.value);
              }}
              size="small"
            >
              {netWorks.map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </Select>

            <Input
              type="file"
              inputProps={{ accept: ".html" }}
              onChange={(e: any) => {
                e.target.files && console.log(e.target.files);
                e.target.files && setFile(e.target.files[0]);
                if (e.target.files) {
                  const reader = new FileReader();
                  reader.readAsText(e.target.files[0] as Blob);
                  reader.onload = (e) => {
                    const androidLink = getUrlStore(
                      "android",
                      e.target?.result as string
                    );
                    const iosLink = getUrlStore(
                      "ios",
                      e.target?.result as string
                    );
                    setLinkAndroid(androidLink);
                    setLinkIOS(iosLink);
                  };
                } else {
                  setLinkAndroid("");
                  setLinkIOS("");
                }
              }}
            />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
