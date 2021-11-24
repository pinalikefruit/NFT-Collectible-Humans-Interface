import { useMemo } from 'react';
import { useWeb3React } from "@web3-react/core";
import PinaPunksArtifact from '../../config/web3/artifacts/PinaPunks';

const { address, abi } = PinaPunksArtifact

const usePinaPunks = () => {
    const { active, library, chainId } = useWeb3React();

    const pinaPunks = useMemo(() => {
        if(active) return new library.eth.Contract(abi, address[chainId]);
    },   [active, chainId, library?.eth?.Contract]);

    return pinaPunks;
};

export default usePinaPunks;