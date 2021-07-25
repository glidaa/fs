import React from 'react';
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import styledComponents from "styled-components"
import { API, graphqlOperation } from "aws-amplify";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import * as notesActions from "../actions/notes"
import * as observersActions from "../actions/observers"
import * as mutations from "../graphql/mutations"
import { AuthState } from '@aws-amplify/ui-components';
import { Redirect, useHistory } from "react-router-dom"

const Loading = (props) => {
  const { user, route, dispatch } = props
  const [shouldLogin, setShouldLogin] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState("Please Wait A Moment")
  const history = useHistory()
  useEffect(() => {
    (async () => {
    const { match: { params } } = route
    if (user.state === AuthState.SignedIn) {
      const localProjectsList = JSON.parse(window.localStorage.getItem("projects"))
      if (localProjectsList) {
        const localProjects = Object.values(localProjectsList)
        if (localProjects && localProjects.length > 0) {
          try {
            setLoadingMsg("We Are Importing Your Local Projects")
            const data = await API.graphql(graphqlOperation(mutations.importData, {
              data: JSON.stringify(localProjects)
            }))
            window.localStorage.removeItem('projects')
          } catch (err) {
            console.error(err)
          }
        }
      }
    }
    if (params.projectPermalink &&
        !params.username &&
        user.state === AuthState.SignedOut) {
      setLoadingMsg("We Are Fetching Your Own Projects")
      const projects = await dispatch(projectsActions.handleFetchOwnedProjects())
      const reqProject = Object.values(projects.owned)
        .filter(x => x.permalink === params.projectPermalink)[0]
      if (reqProject) {
        dispatch(appActions.handleSetProject(reqProject.id, false))
        setLoadingMsg("We Are Getting The Requested Notes")
        await dispatch(notesActions.handleFetchNotes(reqProject.id))
        dispatch(appActions.setLoading(false))
      } else {
        history.replace("/")
        dispatch(appActions.setLoading(false))
      }
    } else if (params.projectPermalink &&
      params.username &&
      user.state === AuthState.SignedOut) {
        setShouldLogin(true)
    } else if (params.projectPermalink &&
      params.username &&
      user.state === AuthState.SignedIn) {
        setLoadingMsg("We Are Fetching Your Own Projects")
        await dispatch(projectsActions.handleFetchOwnedProjects())
        setLoadingMsg("We Are Fetching Projects Assigned To You")
        const projects = await dispatch(projectsActions.handleFetchAssignedProjects())
        dispatch(observersActions.handleSetProjectsObservers())
        const allProjects = Object.values({...projects.owned, ...projects.assigned})
        const reqUserProjects = allProjects.filter(x => x.owner === params.username)
        if (reqUserProjects.length > 0) {
          const reqProject = reqUserProjects.filter(x => x.permalink === params.projectPermalink)[0]
          if (reqProject) {
            dispatch(appActions.handleSetProject(reqProject.id, false))
            setLoadingMsg("We Are Getting The Requested Notes")
            const notes = await dispatch(notesActions.handleFetchNotes(reqProject.id))
            if (params.notePermalink) {
              const reqNote = Object.values(notes).filter(x => x.permalink === parseInt(params.notePermalink, 10))[0]
              if (reqNote) {
                dispatch(appActions.handleSetNote(reqNote.id, false))
                dispatch(appActions.setLoading(false))
              } else {
                dispatch(appActions.setLoading(false))
              }
            } else {
              history.replace(`/${params.username}/${params.projectPermalink}`)
              dispatch(appActions.setLoading(false))
            }
          } else {
            history.replace("/")
            dispatch(appActions.setLoading(false))
          }
        } else {
          history.replace("/")
          dispatch(appActions.setLoading(false))
        }
      } else {
        if (user.state === AuthState.SignedIn) {
          setLoadingMsg("We Are Fetching Your Own Projects")
          await dispatch(projectsActions.handleFetchOwnedProjects())
          setLoadingMsg("We Are Fetching Projects Assigned To You")
          await dispatch(projectsActions.handleFetchAssignedProjects())
          dispatch(observersActions.handleSetProjectsObservers())
          dispatch(appActions.setLoading(false))
        } else {
          setLoadingMsg("We Are Fetching Your Own Projects")
          await dispatch(projectsActions.handleFetchOwnedProjects())
          dispatch(appActions.setLoading(false))
        }
      }
    })()
  }, [])
  return (
    <>
      {shouldLogin ? (
        <Redirect
          to={{
            pathname: "/login",
            state: { referrer: route.location.pathname }
          }}
        />
      ) : (
        <LoadingContainer>
          <Logo>
            <div>
              <div />
              <div />
              <div />
            </div>
          </Logo>
          <span>Forward Slash</span>
          <span>{loadingMsg}</span>
        </LoadingContainer>
      )}
    </>
  )
}

const LoadingContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #E0E0E0;
  align-items: center;
  justify-content: center;
  gap: 30px;
  & > span:nth-child(2) {
    font-weight: bold;
    font-size: 2.5em;
    color: grey;
  }
  & > span:nth-child(3) {
    font-weight: bold;
    font-size: 1.2em;
    color: #222222;
  }
`

const Logo = styledComponents.div`
  margin: 35px;
  border-radius: 50px;
  background: #e0e0e0;
  box-shadow:  20px 20px 60px #bebebe,
              -20px -20px 60px #ffffff;
  width: 250px;
  height: 250px;
  padding: 50px;
  & > div {
    display: flex;
    flex-direction: column;
    gap: 25px;
    & > * {
      width: 200px;
      height: 35px;
      border-radius: 10px;
      background: #e0e0e0;
      box-shadow: inset 20px 20px 60px #bebebe,
                  inset -20px -20px 60px #ffffff;
    }
  }
`

export default connect((state) => ({
  user: state.user,
  projects: state.projects,
  notes: state.notes,
  comments: state.comments
}))(Loading);