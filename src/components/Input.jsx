   function Input(props) {
     return (
       <input
         type={props.type}
         placeholder={props.placeholder}
         value={props.value}
         onChange={props.onChange}
        //  className="p-2 border rounded-lg w-full"
        // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        className={props.className}
       />
     );
   };
   
   export default Input;

   
  //  export default SignInUpForm;