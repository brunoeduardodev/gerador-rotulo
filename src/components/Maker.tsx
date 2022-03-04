import {
  Flex,
  FormControl,
  FormLabel,
  Stack,
  Input,
  Button,
  AspectRatio,
  Image as ChakraImage,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Rotulo from "../assets/rotulo.jpg";

import moment from "moment";

const Maker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const [canvasImage, setCanvasImage] = useState("");

  const [fabrication, setFabrication] = useState("");
  const [expiration, setExpiration] = useState("");

  useEffect(() => {
    if (!fabrication || !expiration) return;
    if (!canvasRef.current) return;
    if (!containerRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = 887;
    canvas.height = 591;

    const context = canvas.getContext("2d")!;
    const background = new Image();
    background.src = Rotulo;
    background.onload = () => {
      context.drawImage(background, 0, 0);

      context.font = "bold 40px Arial";
      context.fillStyle = "black";

      context.fillText(moment(fabrication).format("DD MM YYYY"), 115, 490);
      context.fillText(moment(expiration).format("DD MM YYYY"), 410, 490);
      console.log("text filled");

      setCanvasImage(canvas.toDataURL());
    };
  }, [canvasRef, fabrication, expiration]);

  useEffect(() => {
    const today = new Date();
    const currentWeekDay = today.getDay();

    const getCurrentThursdayDistance = () => {
      const day = currentWeekDay === 0 ? 7 : currentWeekDay;

      if (day > 3) return 4 - day;
      return -(day + 3);
    };

    const currentThursdayDistance = getCurrentThursdayDistance();
    console.log("distance: ", currentThursdayDistance);

    const nextTravelDistanceInDays = currentThursdayDistance + 14;
    console.log("nextTravel", nextTravelDistanceInDays);

    const nextTravelDate = moment(today).add(nextTravelDistanceInDays, "days");
    console.log("next travel date: ", nextTravelDate);
    const fabricationDate = moment(nextTravelDate).subtract(2, "days");
    const expirationDate = moment(fabricationDate).add(90, "days");

    setFabrication(fabricationDate.format("YYYY-MM-DD"));
    setExpiration(expirationDate.format("YYYY-MM-DD"));
  }, []);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    if (!downloadRef.current) return;
    const canvas = canvasRef.current;
    const downloadHref = canvas.toDataURL();
    downloadRef.current.href = downloadHref;
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    if (!downloadRef.current) return;
    const canvas = canvasRef.current;
    const downloadHref = canvas.toDataURL();

    fetch(downloadHref)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "rotulo.png", { type: "image/png" });
        navigator.share({
          files: [file],
          title: `Rótulo do dia ${moment(fabrication).format("DD/MM/YYYY")}`,
          text: `Rótulo do dia ${moment(fabrication).format("DD/MM/YYYY")}`,
        });
      });
  };

  const handleFabricationChange = (newDate: string) => {
    setFabrication(newDate);
    setExpiration(moment(newDate).add(90, "days").format("YYYY-MM-DD"));
  };

  const handleExpirationChange = (newDate: string) => {
    setExpiration(newDate);
  };

  return (
    <Flex
      flexDir="column"
      w={{ base: "90%", lg: "600px" }}
      mx="auto"
      align="center"
      mt={12}
    >
      <AspectRatio w="full" ref={containerRef} ratio={3 / 2} mb={12}>
        <>
          <ChakraImage
            position="absolute"
            top="0"
            left="0"
            opacity={0}
            zIndex={2}
            src={canvasImage || Rotulo}
          />
          <canvas ref={canvasRef} />
        </>
      </AspectRatio>

      <Stack
        w="full"
        mb={6}
        direction={{ base: "column", md: "row" }}
        spacing={4}
      >
        <FormControl>
          <FormLabel>Data de Fabricação</FormLabel>
          <Input
            value={moment(fabrication).format("YYYY-MM-DD")}
            onChange={(e) => handleFabricationChange(e.target.value)}
            type="date"
            placeholder="Data Fabricação"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Data de Validade</FormLabel>
          <Input
            value={moment(expiration).format("YYYY-MM-DD")}
            onChange={(e) => handleExpirationChange(e.target.value)}
            type="date"
            placeholder="Data Fabricação"
          />
        </FormControl>
      </Stack>

      <Stack
        w="full"
        mb={6}
        direction={{ base: "column", md: "row" }}
        spacing={4}
      >
        <Button
          w="full"
          as="a"
          ref={downloadRef as any}
          download={`rotulo-${moment(fabrication).format("DD-MM-YYYY")}`}
          onClick={handleDownload}
          fontWeight="bold"
          color="white"
          colorScheme={"orange"}
        >
          Baixar
        </Button>

        <Button
          w="full"
          fontWeight="bold"
          onClick={handleShare}
          color="white"
          colorScheme={"whatsapp"}
        >
          Compartilhar
        </Button>
      </Stack>
    </Flex>
  );
};

export default Maker;
