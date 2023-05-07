export default function Error({ errors }) {
  {
    return (
      <ul>
        {errors.map((err) => {
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
