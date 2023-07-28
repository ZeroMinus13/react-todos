import React from 'react';

export async function getServerSideProps() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
  const data = await res.json();
  console.log('hello', data);
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: data,
    },
  };
}

function Pokemon(props: { data: any }) {
  console.log(props.data);
  return (
    <div>
      <h1>{props.data ? props.data.name : 'll'}</h1>
      {/* Additional content */}
    </div>
  );
}

export default Pokemon;
