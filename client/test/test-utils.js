import "regenerator-runtime/runtime";
import React, { Suspense } from "react";
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@material-ui/styles";
import {
  GET_ACTIVE_USER,
  SCHOOLS,
  CREATE_SCHOOL,
  CREATE_HOURS,
  CREATE_TERM,
} from "../src/queries";
import theme from "../src/components/theme";
import Loading from "../src/components/Loading";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import i18 from "./i18test";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { schoolId, newHours, newHoursResult } from "./repository";
import termData from "../src/components/page/dashboard/School/Term/termValues";
import fetch from "node-fetch";
const httpLink = new HttpLink({ uri: "http://localhost:6000/graphql", fetch });
console.log(
  "-------------------------------------------------------------------------------------------------"
);
const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        //  sendToLoggingService(graphQLErrors);
      }
      if (networkError) {
        console.log("network hatası");
      }
    }),
    httpLink,
  ]),
  cache: new InMemoryCache(),
});

const termId = "5d7a4e60042hc7g8bc26f2ce";
const term = {
  ...termData[0],
  name: "Term name 74f",
  _id: termId,
  createdAt: Date.now().toString(),
  __typename: "Term",
};
const school = {
  classes: [],
  createdAt: "2019-09-14T16:45:35.919Z",
  headMaster: null,
  hours: [],
  teachers: [],
  terms: [{ ...term }],
  __typename: "School",
};
const schoolMain = {
  _id: schoolId,
  name: "High School",
  eOkulCode: null,
};
const newSchool = { name: "New School", eOkulCode: "78935715" };
const { _id, ...restSchool } = schoolMain;
const mocks = [
  {
    request: {
      query: GET_ACTIVE_USER,
    },
    result: {
      data: {
        activeUser: {
          _id: "5d7a4e60042ac718bc26f2ce",
          firstName: "myname",
          lastName: "mylastname",
          email: "myname@mail.com",
          createdAt: Date.now().toString(),
          __typename: "user",
        },
      },
    },
  },
  {
    request: {
      query: SCHOOLS,
    },
    result: {
      data: {
        schools: [
          {
            ...school,
            ...schoolMain,
            hours: [],
          },
        ],
      },
    },
  },
  {
    request: {
      //update
      query: CREATE_SCHOOL,
      variables: {
        ...schoolMain,
        name: "Schoo Name 2",
      },
    },
    result: {
      data: {
        createSchool: {
          ...school,
          ...schoolMain,
          name: "Schoo Name 2",
          __typename: "school",
        },
      },
    },
  },
  {
    request: {
      query: CREATE_SCHOOL,
      variables: { ...newSchool },
    },
    result: {
      data: {
        createSchool: {
          ...school,
          ...newSchool,
          _id: "5d7a4e60042ac718bc26f2cf",
        },
      },
    },
  },
  {
    request: {
      query: CREATE_HOURS,
      variables: { ...newHours, schoolId },
    },
    result: {
      data: {
        createHour: { ...newHoursResult },
      },
    },
  },
  {
    request: {
      query: CREATE_TERM,
      variables: { ...termData[0], schoolId },
    },
    result: {
      data: {
        createTerm: {
          ...termData[0],
          __typename: "Term",
          _id: "5d7a4e61042ac718bc26f2cg",
        },
      },
    },
  },
  //update
  {
    request: {
      query: CREATE_TERM,
      variables: {
        ...termData[0],
        _id: termId,
        schoolId,
        name: "lorem ipsum 44",
      },
    },
    result: {
      data: {
        createTerm: { ...term, name: "lorem ipsum 44" },
      },
    },
  },
];

const mocksUserNull = [
  {
    request: {
      query: GET_ACTIVE_USER,
    },
    result: {
      data: {
        activeUser: null,
      },
    },
  },
  {
    request: {
      query: SCHOOLS,
    },
    result: {
      data: {
        schools: [],
      },
    },
  },
];

const AllTheProviders = (nonUser) => ({ children }) => {
  return (
    <MockedProvider mocks={mocks}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<Loading />}>
          <MemoryRouter>
            <I18nextProvider i18n={i18}>{children}</I18nextProvider>
          </MemoryRouter>
        </Suspense>
      </ThemeProvider>
    </MockedProvider>
  );
};

const customRender = (ui, options, nonUser) =>
  render(ui, { wrapper: AllTheProviders(nonUser), ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
//<MockedProvider mocks={nonUser ? mocksUserNull : mocks} addTypename={false}>
