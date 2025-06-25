import styled from 'styled-components/native';
import {ViewProps} from 'react-native';

// Define an interface that extends the base ViewProps with any additional custom props
interface SeparatorViewProps extends ViewProps {
  width?: string; // Make width an optional prop
}

// Use the interface to type your styled component
export const SeparatorView = styled.View<SeparatorViewProps>`
  width: ${props => props.width || '90%'};
  height: 1px;
  align-self: center;
  background-color: ${props => props.theme.separatorLineColor};
`;
