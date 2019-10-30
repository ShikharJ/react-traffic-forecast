/**
 * Created by ivan on 02.07.18.
 */

import React, { memo } from 'react';
import moment from 'moment';
import styled from '@emotion/styled';

import { Celsius } from "../../components/Common.jsx";
import StyleConst from '../../style/constants';

const Card = styled('div')`
  flex: 0 0 240px;
  padding: 15px;
  border: 1px solid rgba(0, 0, 0, .3);
  border-radius: 12px;
  background-color: rgb(245, 245, 245);
  
  @media (max-height: ${StyleConst.xs}) and (orientation: landscape) {
      padding: 8px;
  }
`;

const Header = styled('div')`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
`;

const WeatherImage = styled('img')`
  width: 50px;
  height: 50px;
  margin-right: 20px;
  border-radius: 50%;
  background-color: #d3d3d3;
`;

const Title = styled('div')`
  font-size: 16px;
  font-weight: bold;
`;

const Subtitle = styled('div')`
  font-size: 14px;
  font-weight: bold;
`;

const HideXs = styled('div')`
  @media (max-height: ${StyleConst.xs}) and (orientation: landscape) {
    display: none;
  }
`;

const Temperature = styled(HideXs)`
  font-size: 16px;
`;

const Additional = styled(HideXs)``;

const WeatherCard = memo(props => {
    const day = props.day;

    return (
        <Card>
            <Header>
                <WeatherImage src={`https://openweathermap.org/img/w/${day.main.icon}.png`}
                              alt={day.main.icon} />

                <div>
                    <Title>{moment.unix(day.date).format('ddd, MMM Do')}</Title>
                    <Subtitle>{day.main.description}</Subtitle>
                </div>
            </Header>

            <Additional>
                <div><strong>Observed Forward Traffic: </strong>{day.oft} </div>
                <div><strong>Observed Return Traffic: </strong>{day.ort} </div>
            </Additional>

            <Additional>
                <div><strong>Estimated Forward Traffic: </strong>{day.eft} </div>
                <div><strong>Estimated Return Traffic: </strong>{day.ert} </div>
            </Additional>
        </Card>
    );
});

export default WeatherCard;