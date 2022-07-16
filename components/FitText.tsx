// import useFitText from "use-fit-text";
import { Textfit } from 'react-textfit';

export default function FitText({ ...props }) {
  // const { fontSize, ref } = useFitText({
  //   maxFontSize: 5000,
  //   minFontSize: 8
  // });

  return (
      <Textfit mode="single">
        {/* Fat headline! */}
        {props.children}
      </Textfit>
    // <div ref={ref} style={{ fontSize }} {...props}>
    //   {props.text ?? props.children}
    // </div>
  );
}
