import { isLoggedInState } from '@/states/traveler';
import React from 'react';
import { useRecoilValue } from 'recoil';

export function LoginSplitter(props: { whenLoggedIn: React.Component; orElse: React.Component }) {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  return <>{isLoggedIn ? props.whenLoggedIn : props.orElse}</>;
}
