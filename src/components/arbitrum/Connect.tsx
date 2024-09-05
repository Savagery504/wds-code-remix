import { useEffect, useState } from 'react';
import { MetamaskConnect } from './MetamaskConnect';
import { Project } from './Project';
import { Client } from '@remixproject/plugin';
import { Api } from '@remixproject/plugin-utils';
import { IRemixApi } from '@remixproject/plugin-api';
import { Connect as CommonConnect } from '../common/Connect';
import { ARBITRUM_ONE_CHAIN, ARBITRUM_SEPOLIA_CHAIN } from './const';

interface InterfaceProps {
  client: Client<Api, Readonly<IRemixApi>>;
}

export const Connect: React.FunctionComponent<InterfaceProps> = ({ client }) => {
  const [wallet, setWallet] = useState('');
  const [account, setAccount] = useState('');
  const [injectedProvider, setInjectedProvider] = useState();
  const [providerNetwork, setProviderNetwork] = useState<string>('neutron-1');
  const [active, setActive] = useState<boolean>(false);

  return (
    <div>
      <CommonConnect
        client={client}
        active={active}
        setActive={setActive}
        chain={'arbitrum'}
        setWallet={setWallet}
        wallet={wallet}
      />
      <div style={{ height: '0.7em' }}></div>
      <div>
        <MetamaskConnect
          active={active}
          account={account}
          setAccount={setAccount}
          client={client}
          setActive={setActive}
          setInjectedProvider={setInjectedProvider}
          setProviderNetwork={setProviderNetwork}
        />
        {[ARBITRUM_SEPOLIA_CHAIN.chainId, ARBITRUM_ONE_CHAIN.chainId].includes(providerNetwork) ? (
          <Project
            account={account}
            injectedProvider={injectedProvider}
            client={client}
            providerNetwork={providerNetwork}
          />
        ) : null}
      </div>
    </div>
  );
};
