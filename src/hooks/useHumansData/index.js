import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import useHumans from "../useHumans";

const getPunkData = async ({ humans, tokenId }) => {
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
    humans.methods.tokenURI(tokenId).call(),
    humans.methods.tokenDNA(tokenId).call(),
    humans.methods.ownerOf(tokenId).call(),
    humans.methods.getAccessoriesType(tokenId).call(),
    humans.methods.getAccessoriesType(tokenId).call(),
    humans.methods.getClotheColor(tokenId).call(),
    humans.methods.getClotheType(tokenId).call(),
    humans.methods.getEyeType(tokenId).call(),
    humans.methods.getEyeBrowType(tokenId).call(),
    humans.methods.getFacialHairColor(tokenId).call(),
    humans.methods.getFacialHairType(tokenId).call(),
    humans.methods.getHairColor(tokenId).call(),
    humans.methods.getHatColor(tokenId).call(),
    humans.methods.getGraphicType(tokenId).call(),
    humans.methods.getMouthType(tokenId).call(),
    humans.methods.getSkinColor(tokenId).call(),
    humans.methods.getTopType(tokenId).call(),
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
const useHumansData = ({ owner = null } = {}) => {
  const [punks, setPunks] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const humans = useHumans();

  const update = useCallback(async () => {
    if (humans) {
      setLoading(true);

      let tokenIds;

      if (!library.utils.isAddress(owner)) {
        const totalSupply = await humans.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply))
          .fill()
          .map((_, index) => index);
      } else {
        const balanceOf = await humans.methods.balanceOf(owner).call();

        const tokenIdsOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_, index) =>
            humans.methods.tokenOfOwnerByIndex(owner, index).call()
          );

        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, humans })
      );

      const punks = await Promise.all(punksPromise);

      setPunks(punks);
      setLoading(false);
    }
  }, [humans, owner, library?.utils]);

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
const useHumanData = (tokenId = null) => {
  const [punk, setPunk] = useState({});
  const [loading, setLoading] = useState(true);
  const humans = useHumans();

  const update = useCallback(async () => {
    if (humans && tokenId != null) {
      setLoading(true);

      const toSet = await getPunkData({ tokenId, humans });
      setPunk(toSet);

      setLoading(false);
    }
  }, [humans, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punk,
    update,
  };
};

export { useHumanData, useHumansData };