import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import usePinaPunks from "../usePinaPunks";

const getPunkData = async ({ pinaPunks, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    pinaPunks.methods.tokenURI(tokenId).call(),
    pinaPunks.methods.tokenDNA(tokenId).call(),
    pinaPunks.methods.ownerOf(tokenId).call(),
    pinaPunks.methods.getAccessoriesType(tokenId).call(),
    pinaPunks.methods.getAccessoriesType(tokenId).call(),
    pinaPunks.methods.getClotheColor(tokenId).call(),
    pinaPunks.methods.getClotheType(tokenId).call(),
    pinaPunks.methods.getEyeType(tokenId).call(),
    pinaPunks.methods.getEyeBrowType(tokenId).call(),
    pinaPunks.methods.getFacialHairColor(tokenId).call(),
    pinaPunks.methods.getFacialHairType(tokenId).call(),
    pinaPunks.methods.getHairColor(tokenId).call(),
    pinaPunks.methods.getHatColor(tokenId).call(),
    pinaPunks.methods.getGraphicType(tokenId).call(),
    pinaPunks.methods.getMouthType(tokenId).call(),
    pinaPunks.methods.getSkinColor(tokenId).call(),
    pinaPunks.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

// Plural
const usePinaPunksData = ({ owner = null } = {}) => {
  const [punks, setPunks] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const pinaPunks = usePinaPunks();

  const update = useCallback(async () => {
    if (pinaPunks) {
      setLoading(true);

      let tokenIds;

      if (!library.utils.isAddress(owner)) {
        const totalSupply = await pinaPunks.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply))
          .fill()
          .map((_, index) => index);
      } else {
        const balanceOf = await pinaPunks.methods.balanceOf(owner).call();

        const tokenIdsOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_, index) =>
            pinaPunks.methods.tokenOfOwnerByIndex(owner, index).call()
          );

        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, pinaPunks })
      );

      const punks = await Promise.all(punksPromise);

      setPunks(punks);
      setLoading(false);
    }
  }, [pinaPunks, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punks,
    update,
  };
};

// Singular
const usePlatziPunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({});
  const [loading, setLoading] = useState(true);
  const pinaPunks = usePinaPunks();

  const update = useCallback(async () => {
    if (pinaPunks && tokenId != null) {
      setLoading(true);

      const toSet = await getPunkData({ tokenId, pinaPunks });
      setPunk(toSet);

      setLoading(false);
    }
  }, [pinaPunks, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punk,
    update,
  };
};

export { usePinaPunksData, usePlatziPunkData };