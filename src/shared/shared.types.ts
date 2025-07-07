import {Alarm, DetailMeQuery, Location} from '../generated/graphql';

export type RootStackParamList = {
  Chats: any;
  Profile: any;
  TabNav: any;
  MatchTabNav: any;
  StackLogin: {username: string; password: string} | undefined;
  Welcome: any;
  CreateAccount: any;
  EachRoom: {id: number; talkingTo: string | undefined};
  ConditionStep: any;
  StepBar: any;
  StepOne: any;
  StepTwo: any;
  StepThree: any;
  StepFour: any;
  StepFive: any;
  Rooms: any;
  MyProfile: any;
  Map: undefined;
  Matches: any;
  Following: any;
  MatchesTab: any;
  StackProfileNav: any;
  StackProfile: any;
  EditProfile: {editData: NonNullableDetailMeQuery};
  StackMessagesNav: any;
  SimpleProfile: {id: number};
  StackPhoto: {photoUrl: string};
  Alarms: any;
  GreenLightAlarm: {alarm: Alarm};
};

export interface User {
  id: number;
  username: string;
  sex: string;
  interestingSex: string;
  interestingAge?: number;
  birthDay: string;
  phoneNo: string;
  password: string;
  instaUsername?: string;
  email?: string;
  following: User[];
  followers: User[];
  avatar?: string;
  photos: Photo[];
  location: Location;
  introduction?: string;
  createdAt: string;
  updatedAt: string;
  isFollowing: boolean;
  userType: string;
  userStatus?: string;
}

export type NonNullableDetailMeQuery = {
  __typename: 'Query';
  me: NonNullable<DetailMeQuery['me']>;
};

export interface Photo {
  id: number;
  user: User;
  file: string;
}

export type CreateAccountValidPage =
  | 'StepOne'
  | 'StepTwo'
  | 'StepThree'
  | 'StepFour'
  | 'StepFive'
  | 'ConditionStep';
