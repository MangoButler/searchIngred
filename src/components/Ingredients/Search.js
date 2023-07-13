import React, { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import Card from "../UI/Card";
import "./Search.css";
import ErrorModal from "../UI/ErrorModal";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;

  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  const filterChangeHandler = (event) => {
    setEnteredFilter(event.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(
          "https://react-http-48ff4-default-rtdb.firebaseio.com/ingredients.json" +
            query,
          "GET"
        );
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    }; //remember that return of use effect needs to return a function that should run before the timeout expires
  }, [enteredFilter, sendRequest, inputRef]);

  useEffect(() => {
    if ((!isLoading, !error, data)) {
      const loadedIngredients = [];
      for (let key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);


  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={filterChangeHandler}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
