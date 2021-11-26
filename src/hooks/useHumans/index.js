import { useMemo } from 'react';
import { useWeb3React } from "@web3-react/core";
import HumansArtifact from '../../config/web3/artifacts/Humans';

const { address, abi } = HumansArtifact

const useHumans = () => {
    const { active, library, chainId } = useWeb3React();

    const humans = useMemo(() => {
        if(active) return new library.eth.Contract(abi, address[chainId]);
    },   [active, chainId, library?.eth?.Contract]);

    return humans;
};

export default useHumans;