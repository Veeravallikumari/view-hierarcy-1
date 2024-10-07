import './App.css';
import { read, utils } from 'xlsx';
import React, { useState } from "react";
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';


function App() {
  const [project, setProjects] = useState([]);
  const [projectInfo, setProjectInfo] = useState();
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentProject, setCurrentProject] = useState('')

  const groupBy = (data, key) => {
    const groupByResponse = data.reduce((acc, curr) => {
      if (!acc[curr[key]]) acc[curr[key]] = []; //If this type wasn't previously stored
      acc[curr[key]].push(curr);
      return acc;
    }, {});
    return groupByResponse;
  }

  const _handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const wb = read(data);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const associateData = utils.sheet_to_json(ws);
    const groupByProject = groupBy(associateData, 'Project name');
    let projectData = {}
    for (const [project, members] of Object.entries(groupByProject)) {
      const groupByLocation = groupBy(members, 'Location');
      projectData[project] = groupByLocation;
    }
    setProjects(Object.keys(projectData))
    setProjectInfo(projectData)
    console.log('projectData', projectData)

  }

  const handleChange = (e) => {
    setSelectedProject(projectInfo[e.target.value]);
    setCurrentProject(e.target.value)
    console.log(projectInfo[e.target.value])
  }

  const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid red;
`;


  return (
    <>
      <input
        type="file" onInput={_handleFile} />
      {
        project.length !== 0 && <select onChange={handleChange}>
          <option value="">Select Project </option>
          {project.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      }
      {
        selectedProject &&
        <Tree
          lineWidth={'2px'}
          lineColor={'green'}
          lineBorderRadius={'10px'}
          label={<StyledNode>{currentProject}</StyledNode>}
        >
          {selectedProject?.Onsite?.length !== 0 &&
            <TreeNode label={<StyledNode>Onsite</StyledNode>}>
              {selectedProject?.Onsite?.map((a) => {
                return <>
                  <TreeNode label={<StyledNode><div>{`Associate name:${a['Associate Name']}`}
                  </div><div> {`Associate Id:${a['Associate ID']}`}</div></StyledNode>} />
                </>
              })
              }
            </TreeNode>
          }
          {selectedProject?.Offshore?.length !== 0 &&
            <TreeNode label={<StyledNode>Offshore</StyledNode>}>
              {selectedProject?.Offshore?.map((a) => {
                console.log('selectedProject', selectedProject)
                return <TreeNode label={<StyledNode><div>{`Associate name:${a['Associate Name']}`}
                </div><div> {`Associate Id:${a['Associate ID']}`}</div></StyledNode>} />
              })
              }
            </TreeNode>
          }
        </Tree>
      }
    </>
  );
}

export default App;


