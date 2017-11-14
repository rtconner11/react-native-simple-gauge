import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, ViewPropTypes } from 'react-native';
import { Surface, Shape, Path, Group } from '../../react-native/Libraries/ART/ReactNativeART';
import MetricsPath from 'art/metrics/path';

export default class CircularProgress extends React.Component {

    circlePath(cx, cy, r, startDegree, endDegree) {
        let p = Path();

        p.path.push(0, cx + r, cy);
        p.path.push(4, cx, cy, r, startDegree * Math.PI / 180, endDegree * Math.PI / 180, 1);

        return p;
    }

    extractFill(fill) {
        if(fill < 0.01) {
          return 0
        } else if (fill > 100) {
          return 100
        }

        return fill
    }

    render() {
        const { size, width, tintColor, backgroundColor, style, strokeCap, rotation, cropDegree, children } = this.props
        const containerSize = size + 12
        const center = containerSize / 2
        const radius = size / 2 - width / 2

        const backgroundPath = this.circlePath(center, center, radius, 0, (360 * 99.9 / 100) - cropDegree)

        const fill = this.extractFill(this.props.fill)
        const endDegrees = ((360 * 99.9 / 100) - cropDegree) * fill / 100
        const endRadians = endDegrees * Math.PI / 180

        const circlePath = this.circlePath(center, center, radius, 0, endDegrees)

        // the formula for calculating the x,y position of a point on a circle's circumference is:
        // x = cx + r * cos(a)
        // y = cy + r * sin(a)
        // where r is the radius, cx,cy is the center point of the circle, and a is the angle
        const x = center + radius * Math.cos(endRadians)
        const y = center + radius * Math.sin(endRadians)

        const smallCircle = this.circlePath(x, y, 4, 0, 359)

        return (
            <View style={[style, {alignItems: 'center'}]}>
                <Surface
                    width={containerSize}
                    height={containerSize}>
                    <Group rotation={rotation + cropDegree/2} originX={containerSize/2} originY={containerSize/2}>
                        <Shape d={backgroundPath}
                            stroke={backgroundColor}
                            strokeWidth={width}
                            fill='white'
                            strokeCap={strokeCap}/>
                        <Shape d={circlePath}
                            stroke={tintColor}
                            strokeWidth={3}
                            fill='white'
                            strokeCap={strokeCap}/>
                        <Shape d={smallCircle}
                            stroke={backgroundColor}
                            fill='white'
                            strokeWidth={4}
                            strokeCap={strokeCap} />
                    </Group>
                </Surface>
                {
                    children && children(fill)
                }
            </View>
        )
    }

}

CircularProgress.propTypes = {
    style: ViewPropTypes.style,
    size: PropTypes.number.isRequired,
    fill: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    tintColor: PropTypes.string,
    strokeCap: PropTypes.string,
    backgroundColor: PropTypes.string,
    rotation: PropTypes.number,
    cropDegree: PropTypes.number,
    children: PropTypes.func
}

CircularProgress.defaultProps = {
    tintColor: 'black',
    backgroundColor: '#e4e4e4',
    rotation: 90,
    cropDegree: 90,
    strokeCap: 'butt'
}
