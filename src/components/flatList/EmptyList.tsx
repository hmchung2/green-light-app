import React from 'react';
import styled from 'styled-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// 스타일 컴포넌트
const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Title = styled.Text`
  font-size: 18px;
  color: #666;
  margin-top: 12px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #999;
  margin-top: 4px;
`;

// Props 타입 명시
interface EmptyListProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

// 일반 함수 선언 + 명시적 타입
function EmptyList(props: EmptyListProps) {
  const {
    title = '표시할 항목이 없어요',
    subtitle = '데이터가 생기면 여기에 표시돼요',
    icon = <FontAwesome name="bell" size={48} color="#aaa" />,
  } = props;

  return (
    <Container>
      {icon}
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
}

export default EmptyList;
