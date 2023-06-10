export default function Error({ errorsBack }) {
  {
    return (
      <ul>
        {errorsBack.map((err) => {
          return (
            <li className="text-danger" key={err.message}>
              {err.message}
            </li>
          );
        })}
      </ul>
    );
  }
}
