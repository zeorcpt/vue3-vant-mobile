/* eslint-disable @typescript-eslint/no-explicit-any */
import { Props, Render } from './types';

type TProps = Props & { render: Render };

export default (props: TProps, context: any) => {
  const { row, column, index, render } = props;
  return render(h, { row, column, index });
};
