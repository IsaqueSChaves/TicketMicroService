export default function Error({ errors }) {
  {
    errors.length > 0 && (
      <div>
        {errors.map((error) => {
          return <h1>{error.message}</h1>;
        })}
      </div>
    );
  }
}
