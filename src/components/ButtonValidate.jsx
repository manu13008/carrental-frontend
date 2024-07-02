

function ButtonValidate(props) {
    return (

      <button type="submit" 
      className={props.className}
      onClick={props.onClick}>
        {props.value}</button>

    );
  };
  
  export default ButtonValidate;