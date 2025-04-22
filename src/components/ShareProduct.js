import React from "react";
import {
  Box,
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
  useClipboard,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { MDBIcon } from "mdb-react-ui-kit";
import { ShareIcon } from "@chakra-ui/icons";

const ShareProduct = ({ productId, title }) => {
  const shareUrl = `${window.location.origin}/preview_ad/${productId}`;
  const { hasCopied, onCopy } = useClipboard(shareUrl);

  const shareText = `Check out this product: ${title} on RetreND`;

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareViaTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareViaEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  return (
    <Popover placement="bottom" closeOnBlur={true}>
      <PopoverTrigger>
        <Button
          leftIcon={<MDBIcon fas icon="share-alt" />}
          colorScheme="teal"
          variant="outline"
          size="sm"
        >
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold">Share this product</PopoverHeader>
        <PopoverBody>
          <Flex direction="column" gap={2}>
            <Flex justify="space-between" mb={2}>
              <IconButton
                aria-label="Share on WhatsApp"
                icon={<MDBIcon fab icon="whatsapp" />}
                colorScheme="green"
                onClick={shareViaWhatsApp}
              />
              <IconButton
                aria-label="Share on Facebook"
                icon={<MDBIcon fab icon="facebook-f" />}
                colorScheme="facebook"
                onClick={shareViaFacebook}
              />
              <IconButton
                aria-label="Share on Twitter"
                icon={<MDBIcon fab icon="twitter" />}
                colorScheme="twitter"
                onClick={shareViaTwitter}
              />
              <IconButton
                aria-label="Share on Telegram"
                icon={<MDBIcon fab icon="telegram-plane" />}
                colorScheme="blue"
                onClick={shareViaTelegram}
              />
              <IconButton
                aria-label="Share via Email"
                icon={<MDBIcon fas icon="envelope" />}
                colorScheme="red"
                onClick={shareViaEmail}
              />
            </Flex>
            <Flex mt={2}>
              <Button
                size="sm"
                onClick={onCopy}
                colorScheme={hasCopied ? "green" : "gray"}
                flex="1"
              >
                {hasCopied ? "Copied!" : "Copy Link"}
              </Button>
            </Flex>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ShareProduct;