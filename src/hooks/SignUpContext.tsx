import React, {useState} from 'react';
import {format} from 'date-fns';

type SignUpAppContextValue = {
  visitedSteps: string[]; // 👈 plain string array
  setVisitedSteps: React.Dispatch<React.SetStateAction<string[]>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  usernameValidated: boolean;
  usernameSetValidated: (val: boolean) => void;
  reservedUsername: string;
  setReservedUsername: React.Dispatch<React.SetStateAction<string>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  rePassword: string;
  setRePassword: React.Dispatch<React.SetStateAction<string>>;
  sex: 'M' | 'F';
  setSex: React.Dispatch<React.SetStateAction<'M' | 'F'>>;
  birthDay: string;
  setBirthDay: React.Dispatch<React.SetStateAction<string>>;
  avatarUri: string | null;
  setAvatarUri: React.Dispatch<React.SetStateAction<string | null>>;
  reservedEmail: string | null;
  setReservedEmail: React.Dispatch<React.SetStateAction<string | null>>;
  emailValidated: boolean;
  setEmailValidated: React.Dispatch<React.SetStateAction<boolean>>;
  emailCode: string;
  setEmailCode: React.Dispatch<React.SetStateAction<string>>;
};

// email,
//     setEmail,
//     reservedEmail,
//     setReservedEmail,
//     emailValidated,
//     setEmailValidated,
//     setVisitedSteps,
//     visitedSteps,

const SignUpAppContext = React.createContext<SignUpAppContextValue>(
  {} as SignUpAppContextValue,
);

const SignUpAppContextProvider = ({children}: any) => {
  const [usernameValidated, usernameSetValidated] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [reservedUsername, setReservedUsername] = useState<string>('');
  const [email, setEmail] = useState<string | null>(null);
  const [reservedEmail, setReservedEmail] = useState<string | null>(null);
  const [emailValidated, setEmailValidated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [birthDay, setBirthDay] = useState(format(new Date(), 'yyyy/MM/dd'));
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [visitedSteps, setVisitedSteps] = useState<string[]>(['StepOne']);
  const [emailCode, setEmailCode] = useState<string>('');

  const contextValue = {
    username,
    setUsername,
    usernameValidated,
    usernameSetValidated,
    reservedUsername,
    setReservedUsername,
    email,
    setEmail,
    reservedEmail,
    setReservedEmail,
    emailValidated,
    setEmailValidated,
    password,
    setPassword,
    rePassword,
    setRePassword,
    sex,
    birthDay,
    setSex,
    setBirthDay,
    avatarUri,
    setAvatarUri,
    visitedSteps,
    setVisitedSteps,
    emailCode,
    setEmailCode,
  };

  return (
    <SignUpAppContext.Provider value={contextValue}>
      {children}
    </SignUpAppContext.Provider>
  );
};

export {SignUpAppContext, SignUpAppContextProvider};
