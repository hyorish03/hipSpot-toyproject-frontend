import styled from "styled-components";
import { Todo, TodoList } from "./components/CardList";
import { Tag, TagList } from "./components/TagList";
import GlobalStyle from "./GlobalStyle";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { useState } from "react";
import { dateToLocalString } from "./utils/date";
import { useEffect } from "react";
import {
  getTagBackgroundColor,
  getTagColor,
  hipTag,
  tagToLocaleString,
} from "./constants/tag";
import todosWithTagsAndDate from "./recoil/todosWithTagsAndDate";
import { useRecoilValue } from "recoil";
import { Checkbox, CheckboxChecked, Dots, Logo } from "./assets/svg";
import useToggleTodo from "./hooks/useToggleTodo";

function App() {
  const [tags, setTags] = useState(
    hipTag.map((tags) => ({
      ...tags,
      selected: true,
    }))
  );
  const toggleTodo = useToggleTodo();

  const [selectDate, setSelectDate] = useState([
    {
      startDate: new Date("2022-10-04"),
      endDate: new Date("2022-10-06"),
      key: "selection",
    },
  ]);

  const todos = useRecoilValue(
    todosWithTagsAndDate([
      tags.filter((tag) => tag.selected).map((tag) => tag.name),
      selectDate[0].startDate.toISOString(),
      selectDate[0].endDate.toISOString(),
    ])
  );

  const onTagClick = (tag) => {
    setTags(
      tags.map((item) =>
        item.name === tag.name ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const onTodoComplete = (todo) => {
    toggleTodo(todo.id);
  };

  useEffect(() => {
    console.log(tags.filter((tag) => tag.selected).map((tag) => tag.name));
    console.log(todos);
  }, [selectDate, tags]);

  return (
    <Wrapper>
      <GlobalStyle />
      <Logo className="logo" />

      <Calendar>
        <DateRangePicker
          className="dateRangePicker"
          editableDateInputs={true}
          onChange={(item) => setSelectDate([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={selectDate}
          months={1}
          direction="horizontal"
          showDateDisplay={false}
        />
      </Calendar>
      <Section style={{ position: "sticky", top: 0 }}>
        <TagList>
          {tags.map((tag) => (
            <Tag key={tag.name} onClick={() => onTagClick(tag)} tag={tag}>
              #{tag.localeName}
            </Tag>
          ))}
        </TagList>
      </Section>
      <Section>
        <TodoList>
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              color={getTagColor(todo.tag)}
              backgroundColor={getTagBackgroundColor(todo.tag)}
              onClick={() => onTodoComplete(todo)}
            >
              <div className="left">
                {todo.isComplete ? <CheckboxChecked /> : <Checkbox />}
              </div>
              <div className="middle">
                <h1>{todo.title}</h1>
                <div className="tag">#{tagToLocaleString(todo.tag)}</div>
                <p className="date">
                  {dateToLocalString(new Date(todo.modifiedDate))}
                </p>
              </div>
              <div className="right">
                <Dots
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </div>
            </Todo>
          ))}
        </TodoList>
      </Section>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  height: fit-content;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    margin-top: 4px;
    box-shadow: 0px 4px 16px 0px #d0113f29;
  }
`;

const Calendar = styled.div`
  height: fit-content;
  width: 100%;
  background-color: gray;
  .rdrCalendarWrapper {
    width: 100vw;
    .rdrMonth {
      flex: 1;
    }
  }
  .rdrDefinedRangesWrapper {
    display: none;
  }

  /* 버튼 색상 바꿈 */
  .rdrNextPrevButton {
    background-color: #fef5f8;
  }
  .rdrNextButton i {
    border-color: transparent transparent transparent #e44269;
  }
  .rdrPprevButton i {
    border-color: transparent #e44269 transparent transparent;
  }
  /* 범위 색상 바꿈 */
  .rdrStartEdge,
  .rdrEndEdge {
    background-color: #e44269;
  }
  .rdrInRange {
    color: #fef5f8 !important;
  }
  .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
  .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span {
    color: white !important;
  }

  .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span,
  .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span {
    color: #e44269 !important;
  }

  /* 현재날짜 밑줄 */
  .rdrDayToday .rdrDayNumber span:after {
    background-color: #e44269;
  }

  .CalendarDay__selcted {
    border-radius: 90%;
  }
`;

const Section = styled.section`
  width: 100%;
  flex: 1;
  overflow-x: scroll;
  background: #fcfcfc;
  padding-bottom: 16px;
`;
