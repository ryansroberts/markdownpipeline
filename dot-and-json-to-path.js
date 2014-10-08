var fs = require('fs');
var DotParser = require('./scripts/DotParser.js');
var DotGraph = require('./scripts/DotGraph.js').XDotGraph;
var _ = require('underscore');

var jsoninput = process.argv[2];
var dotinput = process.argv[3];
var output = process.argv[4];

var graphJson = require(jsoninput);
var dotFile = fs.readFileSync(dotinput, 'utf8');

var ast = DotParser.parse(dotFile);
var graph = new DotGraph(ast);
graph.walk();

var lookup = {};
var nodeOrder = 0;

function getKeys(node){

  lookup[node.label] = node;

  if (node.childNodes){
    node.childNodes.forEach(function (childNode){

      getKeys(childNode);

    });
  }

}
// go through all the nodes, create a combination node from the graphJson data and the parsed .dot graph data..
// same for edges. Pathways, as a minimum, requires geometry data, shortContent, fullContent and links etc...
// could do with having a look at some Pathways XML in order to establish what data is strictly necessary..


getKeys(graphJson);

var pathway = {
  title : graphJson.label, // use the landing node's label..
  pathwayTitle : graphJson.label,
  pathwaySlug : '/pathways/' + (graphJson.label.toLowerCase()).replace(/\s/g,'-'),
  nodes : [],
  edges : []
};

_.each(graph.nodes, function (node, id){

  // find all edges *from* this node...
  var ref = lookup[id];

  var attr = node.attrs;

  var edges = [];
  /*
  _.each(graph.edges, function (edge){

    if (edge[0].edge[0] === id){
      edges.push({
        sourceside : 'bottom',
        targetside : 'top',
        target : edge[0].edge[1]
      });
    }

  });
*/

  pathway.nodes.push({
    title : id,
    id : (id.toLowerCase()).replace(/\s/g,'-'),
    nodeOrder : ++nodeOrder,
    type : (nodeOrder === 1 ? 'landing' : 'context'),
    shortContent : ref.label,
    fullContent : decodeURIComponent(ref.html),
    geometry : {
      width : attr.width,
      height : attr.height,
      left : attr.pos[0],
      top : attr.pos[1]

    }
  });

});

_.each(graph.edges, function (edge, id){

  pathway.edges.push({
    /*
      {  
         "source":"nodes-person-with-suspected-lung-cancer",
         "target":"nodes-service-organisation",
         "sourceSide":"bottom",
         "targetSide":"top",
         "label":"",
         "type":"directional",
         "uid":"nodes-person-with-suspected-lung-cancerbottomnodes-service-organisationtop"
      },
    */
    source : (edge[0].edge[0].toLowerCase()).replace(/\s/g,'-'),
    target : (edge[0].edge[1].toLowerCase()).replace(/\s/g,'-'),
    sourceSide : 'bottom',
    targetSide : 'top',
    label : '',
    type : 'directional',
    uid : (id.toLowerCase()).replace(/\s/g,'-')
  })

});

fs.writeFile(output, JSON.stringify(pathway), function (err){

  console.log('Done');

});


/*
{
  "path": {
    "-title": "Lung cancer overview",
    "link": [
      {
        "-rel": "self",
        "-uri": "/pathways/lung-cancer/lung-cancer-overview",
        "-title": "Lung cancer overview",
        "-type": "text/html"
      },
      {
        "-rel": "self",
        "-uri": "/pathways/lung-cancer/lung-cancer-overview.xml",
        "-title": "Lung cancer overview",
        "-shorturi": "/pathways/lung-cancer/lung-cancer-overview.xml",
        "-type": "application/vnd.nice.path+xml"
      },
      {
        "-rel": "/rels/view-thumbnail",
        "-uri": "/pathways/lung-cancer/lung-cancer-overview/thumb.xml",
        "-title": "Lung cancer overview",
        "-shorturi": "/pathways/lung-cancer/lung-cancer-overview/thumb.xml",
        "-type": "application/vnd.nice.path-thumbnail+xml"
      },
      {
        "-rel": "pathway",
        "-uri": "/pathways/lung-cancer",
        "-title": "Lung cancer",
        "-slug": "pathways/lung-cancer",
        "-type": "text/html"
      },
      {
        "-rel": "self",
        "-uri": "/pathways/lung-cancer/lung-cancer-overview.pdf",
        "-title": "Lung cancer overview",
        "-type": "application/pdf"
      }
    ],
    "nodes": {
      "node": [
        {
          "-id": "nodes-person-with-suspected-lung-cancer",
          "-type": "landing",
          "-nodeorder": "1",
          "title": "

Person with suspected lung cancer

",
          "shortcontent": "

<div id=\"paths-lung-cancer-overview-nodes-person-with-suspected-lung-cancer-shortcontent\" class=\"fragment shortcontent \"><div class=\"p\">Person with suspected lung cancer</div></div>

",
          "geometry": {
            "-width": "176",
            "-height": "42",
            "-left": "1",
            "-top": "1"
          },
          "link": [
            {
              "-rel": "/rels/connection/arrow",
              "-uri": "#nodes-symptoms-and-signs-indicating-urgent-chest-x-ray-and-urgent-and-immediate-referral",
              "-sourceside": "bottom",
              "-targetside": "top"
            },
            {
              "-rel": "/rels/connection/arrow",
              "-uri": "#nodes-service-organisation",
              "-sourceside": "bottom",
              "-targetside": "top"
            }
          ]
        },
        {
          "-id": "nodes-symptoms-and-signs-indicating-urgent-chest-x-ray-and-urgent-and-immediate-referral",
          "-type": "context",
          "-nodeorder": "2",
          "title": "

Symptoms and signs indicating urgent chest X-ray and urgent and immediate referral

",
          "shortcontent": "

<div id=\"paths-lung-cancer-overview-nodes-symptoms-and-signs-indicating-urgent-chest-x-ray-and-urgent-and-immediate-referral-shortcontent\" class=\"fragment shortcontent \"><div class=\"p\">Symptoms and signs indicating urgent chest <span class=\"no-break\">X-ray</span> and urgent and immediate referral</div></div>

",
          "fullcontent": "

<div id=\"paths-lung-cancer-overview-nodes-symptoms-and-signs-indicating-urgent-chest-x-ray-and-urgent-and-immediate-referral-fullcontent\" class=\"fragment fullcontent \"><h1>Symptoms and signs indicating urgent chest X-ray and urgent and immediate referral</h1><h2>Symptoms and signs indicating urgent chest X-ray</h2><div class=\"p\">Offer urgent chest X-ray to patients presenting with haemoptysis, or any of the following if unexplained or present for more than <span class=\"no-break\">3 weeks</span>:</div><ul><li> cough</li><li> chest/shoulder pain</li><li> dyspnoea</li><li> weight loss</li><li> chest signs</li><li> hoarseness</li><li> finger clubbing</li><li> signs suggesting metastases (for example, in brain, bone, liver or skin)</li><li> cervical/supraclavicular lymphadenopathy.</li></ul><h2>Signs and symptoms indicating urgent and immediate referral</h2><div class=\"p\">Offer urgent referral to lung cancer <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-mdt\" class=\"fragment glossary\">MDT</a> (usually the chest physician) while waiting for chest X-ray results if persistent haemoptysis in a smoker or ex-smoker older than <span class=\"no-break\">40 years</span> is present.</div><div class=\"p\">Offer immediate referral to lung cancer <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-mdt\" class=\"fragment glossary\">MDT</a> (usually the chest physician) while waiting for chest X-ray results if either of the following are present:</div><ul><li> signs of superior vena cava obstruction (swelling of the face and/or neck with fixed elevation of jugular venous pressure)</li><li> stridor.</li></ul><div class=\"p\">Offer urgent referral to lung cancer MDT (usually the chest physician) if:</div><ul><li> a chest X-ray or CT scan suggests lung cancer (including pleural effusion and slowly resolving consolidation) <strong>or</strong></li><li> chest X-ray is normal but there is a high suspicion of lung cancer.</li></ul><div id=\"paths-lung-cancer-overview-nodes-symptoms-and-signs-indicating-urgent-chest-x-ray-and-urgent-and-immediate-referral-fullcontent-qualitystatementreferences\" class=\"fragment qualitystatementreference \"><h1>Quality standards</h1><div class=\"p\"><a rel=\"/rels/view-fragment/quality-statement\" href=\"#quality-statements-referral-for-chest-x-ray\" class=\"fragment quality-statement\"><span><span>2</span><span>Referral for chest X-ray</span></span></a></div></div><div id=\"paths-lung-cancer-overview-nodes-symptoms-and-signs-indicating-urgent-chest-x-ray-and-urgent-and-immediate-referral-fullcontent-relatedguidancereferences\" class=\"fragment relatedguidancereference \"><h1>Related</h1>Failed to load fragment staticcontentfragments/related-guidance-node<div class=\"p\"><a rel=\"/rels/view-fragment/related-guidance\" href=\"#related-guidance-ipg79\" class=\"fragment related-guidance\"><span>IPG79</span></a></div></div><div id=\"paths-lung-cancer-overview-nodes-symptoms-and-signs-indicating-urgent-chest-x-ray-and-urgent-and-immediate-referral-fullcontent-sourceguidancereferences\" class=\"fragment sourceguidancereference \"><h1>Sources</h1><div class=\"p\">The NICE guidance that was used to create this part of the pathway. </div><div class=\"p\"><a rel=\"/rels/view-fragment/source-guidance\" href=\"#source-guidance-cg121\" class=\"fragment source-guidance\"><span>CG121</span></a></div></div></div>

",
          "geometry": {
            "-width": "176",
            "-height": "75",
            "-left": "1",
            "-top": "79"
          },
          "link": {
            "-rel": "/rels/connection/arrow",
            "-uri": "#nodes-information-and-support",
            "-sourceside": "bottom",
            "-targetside": "top"
          }
        },
        {
          "-id": "nodes-information-and-support",
          "-type": "context",
          "-nodeorder": "3",
          "title": "

Information and support

",
          "shortcontent": "

<div id=\"paths-lung-cancer-overview-nodes-information-and-support-shortcontent\" class=\"fragment shortcontent \"><div class=\"p\">Information and support</div></div>

",
          "fullcontent": "

<div id=\"paths-lung-cancer-overview-nodes-information-and-support-fullcontent\" class=\"fragment fullcontent \"><h1>Information and support</h1><div class=\"p\">Raise awareness of the symptoms and signs of lung cancer through coordinated campaigning.</div><div class=\"p\">Ensure that a lung cancer clinical nurse specialist is available at all stages of care to support patients and carers.</div><h2>Effective communication with patients</h2><div class=\"p\">Find out what the patient knows about their condition without assuming a level of knowledge.</div><div class=\"p\">Offer accurate and easy-to-understand information and ensure all communications are worded to assist understanding.</div><div class=\"p\">Explain treatment options (including potential survival benefits, side effects and effect on symptoms) in a private environment, with the support of carers and the time to make an informed choice.</div><div class=\"p\">Consider tailor-made decision aids to help patients understand probable outcomes, weigh up possible benefits and harms and make decisions about treatments.</div><div class=\"p\">Offer patients a record of all discussions and a copy of correspondence with other healthcare professionals, <strong>but avoid giving bad news by letter</strong>.</div><div class=\"p\">Only give bad news by phone in exceptional circumstances.</div><div class=\"p\">When appropriate, sensitively offer to discuss end-of-life care. If possible, avoid leaving this until the terminal stages, but respect the patient&#39;s choice if they do not wish to confront future issues.</div><div class=\"p\">Ensure patients know how to contact the lung cancer clinical nurse specialist between scheduled hospital visits.</div><h2>Effective communication among the <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-mdt\" class=\"fragment glossary\">MDT</a></h2><div class=\"p\">Document discussions with the patient about end-of-life care, particularly about the patient&#39;s specific concerns, their understanding of the prognosis, and important values and preferences for care and treatment.</div><div class=\"p\">Share information between healthcare professionals about the management plan, what the patient has been told and has understood, any problems, any advance decisions and the involvement of other agencies.</div><div class=\"p\">Send a copy of the radiologist&#39;s report to a designated member of the lung cancer <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-mdt\" class=\"fragment glossary\">MDT</a> (usually the chest physician) when a chest X-ray incidentally suggests lung cancer. Ensure the <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-mdt\" class=\"fragment glossary\">MDT</a> has a mechanism for following up these reports with the patient&#39;s GP.</div><div class=\"p\">Discuss care of patients with a working diagnosis of lung cancer at a lung cancer <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-mdt\" class=\"fragment glossary\">MDT</a> meeting.</div><div id=\"paths-lung-cancer-overview-nodes-information-and-support-fullcontent-qualitystatementreferences\" class=\"fragment qualitystatementreference \"><h1>Quality standards</h1><div class=\"p\"><a rel=\"/rels/view-fragment/quality-statement\" href=\"#quality-statements-public-awareness\" class=\"fragment quality-statement\"><span><span>1</span><span>Public awareness</span></span></a></div><div class=\"p\"><a rel=\"/rels/view-fragment/quality-statement\" href=\"#quality-statements-chest-x-ray-report\" class=\"fragment quality-statement\"><span><span>3</span><span>Chest X-ray report</span></span></a> </div><div class=\"p\"><a rel=\"/rels/view-fragment/quality-statement\" href=\"#quality-statements-lung-cancer-clinical-nurse-specialist\" class=\"fragment quality-statement\"><span><span>4</span><span>Lung cancer clinical nurse specialist</span></span></a></div><div class=\"p\"><a rel=\"/rels/view-fragment/quality-statement\" href=\"#quality-statements-holistic-needs-assessment\" class=\"fragment quality-statement\"><span><span>5</span><span>Holistic needs assessment</span></span></a></div></div><div id=\"paths-lung-cancer-overview-nodes-information-and-support-fullcontent-sourceguidancereferences\" class=\"fragment sourceguidancereference \"><h1>Sources</h1><div class=\"p\">The NICE guidance that was used to create this part of the pathway. </div><div class=\"p\"><a rel=\"/rels/view-fragment/source-guidance\" href=\"#source-guidance-cg121\" class=\"fragment source-guidance\"><span>CG121</span></a></div></div></div>

",
          "geometry": {
            "-width": "176",
            "-height": "26",
            "-left": "1",
            "-top": "192"
          },
          "link": {
            "-rel": "/rels/connection/arrow",
            "-uri": "#nodes-advice-on-smoking-cessation",
            "-sourceside": "bottom",
            "-targetside": "top"
          }
        },
        {
          "-id": "nodes-advice-on-smoking-cessation",
          "-type": "context",
          "-nodeorder": "4",
          "title": "

Advice on smoking cessation

",
          "shortcontent": "

<div id=\"paths-lung-cancer-overview-nodes-advice-on-smoking-cessation-shortcontent\" class=\"fragment shortcontent \"><div class=\"p\">Advice on smoking cessation</div></div>

",
          "fullcontent": "

<div id=\"paths-lung-cancer-overview-nodes-advice-on-smoking-cessation-fullcontent\" class=\"fragment fullcontent \"><h1>Advice on smoking cessation</h1><div class=\"p\">Advise patients to stop smoking as soon as lung cancer is suspected and tell them that smoking increases the risk of complications after surgery.</div><div class=\"p\">Offer nicotine replacement therapy and other therapies in line with NICE guidance in the <a rel=\"/rels/view-fragment/pathway\" href=\"/pathways/smoking/support-from-general-nhs-services-to-help-people-stop-smoking#content=view-node%3Anodes-people-who-want-to-quit\" class=\"fragment pathway\">smoking pathway</a>.</div><div class=\"p\">Do not postpone surgery to allow patients to stop smoking.</div><div id=\"paths-lung-cancer-overview-nodes-advice-on-smoking-cessation-fullcontent-sourceguidancereferences\" class=\"fragment sourceguidancereference \"><h1>Sources</h1><div class=\"p\">The NICE guidance that was used to create this part of the pathway. </div><div class=\"p\"><a rel=\"/rels/view-fragment/source-guidance\" href=\"#source-guidance-cg121\" class=\"fragment source-guidance\"><span>CG121</span></a></div></div></div>

",
          "geometry": {
            "-width": "176",
            "-height": "42",
            "-left": "1",
            "-top": "267"
          },
          "link": {
            "-rel": "/rels/connection/arrow",
            "-uri": "#nodes-diagnosis-and-staging-of-lung-cancer",
            "-sourceside": "bottom",
            "-targetside": "top"
          }
        },
        {
          "-id": "nodes-diagnosis-and-staging-of-lung-cancer",
          "-type": "offmapreference",
          "-nodeorder": "5",
          "title": "

Diagnosis and staging of lung cancer

",
          "shortcontent": "

<div id=\"paths-lung-cancer-overview-nodes-diagnosis-and-staging-of-lung-cancer-shortcontent\" class=\"fragment shortcontent \"><div class=\"p\">Diagnosis and staging</div></div>

",
          "link": [
            {
              "-rel": "/rels/view-path",
              "-uri": "/pathways/lung-cancer/diagnosis-and-staging-of-lung-cancer",
              "-title": "Diagnosis and staging of lung cancer",
              "-type": "text/html"
            },
            {
              "-rel": "/rels/view-path",
              "-uri": "/pathways/lung-cancer/diagnosis-and-staging-of-lung-cancer.xml",
              "-title": "Diagnosis and staging of lung cancer",
              "-shorturi": "/pathways/lung-cancer/diagnosis-and-staging-of-lung-cancer.xml",
              "-type": "application/vnd.nice.path+xml"
            },
            {
              "-rel": "/rels/connection/arrow",
              "-uri": "#nodes-treatment-and-supportive-and-palliative-care-for-lung-cancer",
              "-sourceside": "bottom",
              "-targetside": "top"
            }
          ],
          "geometry": {
            "-width": "176",
            "-height": "26",
            "-left": "1",
            "-top": "345"
          }
        },
        {
          "-id": "nodes-treatment-and-supportive-and-palliative-care-for-lung-cancer",
          "-type": "offmapreference",
          "-nodeorder": "6",
          "title": "

Treatment and supportive and palliative care for lung cancer

",
          "shortcontent": "

<div id=\"paths-lung-cancer-overview-nodes-treatment-and-supportive-and-palliative-care-for-lung-cancer-shortcontent\" class=\"fragment shortcontent \"><div class=\"p\">Treatment and supportive and palliative care</div></div>

",
          "link": [
            {
              "-rel": "/rels/view-path",
              "-uri": "/pathways/lung-cancer/treatment-and-supportive-and-palliative-care-for-lung-cancer",
              "-title": "Treatment and supportive and palliative care for lung cancer",
              "-type": "text/html"
            },
            {
              "-rel": "/rels/view-path",
              "-uri": "/pathways/lung-cancer/treatment-and-supportive-and-palliative-care-for-lung-cancer.xml",
              "-title": "Treatment and supportive and palliative care for lung cancer",
              "-shorturi": "/pathways/lung-cancer/treatment-and-supportive-and-palliative-care-for-lung-cancer.xml",
              "-type": "application/vnd.nice.path+xml"
            },
            {
              "-rel": "/rels/connection/arrow",
              "-uri": "#nodes-follow-up",
              "-sourceside": "bottom",
              "-targetside": "top"
            }
          ],
          "geometry": {
            "-width": "176",
            "-height": "42",
            "-left": "1",
            "-top": "442"
          }
        },
        {
          "-id": "nodes-follow-up",
          "-type": "context",
          "-nodeorder": "7",
          "title": "

Follow-up

",
          "shortcontent": "

<div id=\"paths-lung-cancer-overview-nodes-follow-up-shortcontent\" class=\"fragment shortcontent \"><div class=\"p\">Follow-up</div></div>

",
          "fullcontent": "

<div id=\"paths-lung-cancer-overview-nodes-follow-up-fullcontent\" class=\"fragment fullcontent \"><h1>Follow-up</h1><div class=\"p\">Offer an initial specialist follow-up appointment within <span class=\"no-break\">6 weeks</span> of completing treatment to discuss ongoing care. Offer regular appointments thereafter, rather than relying on patients requesting appointments when they experience symptoms.</div><div class=\"p\">Offer protocol-driven follow-up led by a lung cancer clinical nurse specialist as an option for patients with a life expectancy of more than <span class=\"no-break\">3 months</span>.</div><div class=\"p\">Collect the opinion and experience of lung cancer patients and carers to improve the delivery of services. Ensure patients receive feedback on any action taken as a result of such surveys.</div><div id=\"paths-lung-cancer-overview-nodes-follow-up-fullcontent-qualitystatementreferences\" class=\"fragment qualitystatementreference \"><h1>Quality standards</h1><div class=\"p\"><a rel=\"/rels/view-fragment/quality-statement\" href=\"#quality-statements-optimal-follow-up-regime\" class=\"fragment quality-statement\"><span><span>14</span><span>Optimal follow-up regime</span></span></a></div></div><div id=\"paths-lung-cancer-overview-nodes-follow-up-fullcontent-sourceguidancereferences\" class=\"fragment sourceguidancereference \"><h1>Sources</h1><div class=\"p\">The NICE guidance that was used to create this part of the pathway. </div><div class=\"p\"><a rel=\"/rels/view-fragment/source-guidance\" href=\"#source-guidance-cg121\" class=\"fragment source-guidance\"><span>CG121</span></a></div></div></div>

",
          "geometry": {
            "-width": "176",
            "-height": "26",
            "-left": "1",
            "-top": "555"
          }
        },
        {
          "-id": "nodes-service-organisation",
          "-type": "context",
          "-nodeorder": "8",
          "title": "

Service organisation

",
          "shortcontent": "

<div id=\"paths-lung-cancer-overview-nodes-service-organisation-shortcontent\" class=\"fragment shortcontent \"><div class=\"p\">Service organisation</div></div>

",
          "fullcontent": "

<div id=\"paths-lung-cancer-overview-nodes-service-organisation-fullcontent\" class=\"fragment fullcontent \"><h1>Service organisation</h1><div class=\"p\">Provide rapid access clinics where possible for the investigation of suspected lung cancer, because they are associated with faster diagnosis and less patient anxiety.</div><div class=\"p\">All cancer units/centres should have one or more trained lung cancer clinical nurse specialists to see patients before and after diagnosis, to provide continuing support and to facilitate communication between the secondary care team (including the <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-mdt\" class=\"fragment glossary\">MDT</a>), the patient&#39;s GP, the community team and the patient. Their role includes helping patients to access advice and support whenever they need it.</div><div class=\"p\">Every cancer network should have rapid access to PET-CT scanning.</div><div class=\"p\">Every cancer network should have at least one centre with <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-ebus\" class=\"fragment glossary\">EBUS</a> and/or <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-eus\" class=\"fragment glossary\">EUS</a>.</div><div class=\"p\">Audit the local test performance of non-ultrasound-guided <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-tbna\" class=\"fragment glossary\">TBNA</a>, <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-ebus\" class=\"fragment glossary\">EBUS</a> and <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-eus\" class=\"fragment glossary\">EUS</a>-guided <a rel=\"/rels/view-fragment/glossary\" href=\"#glossary-fna\" class=\"fragment glossary\">FNA</a>. </div><div class=\"p\">Every cancer network should ensure that patients have rapid access to a team capable of providing interventional endobronchial treatments.</div><div id=\"paths-lung-cancer-overview-nodes-service-organisation-fullcontent-qualitystatementreferences\" class=\"fragment qualitystatementreference \"><h1>Quality standards</h1><div class=\"p\"><a rel=\"/rels/view-fragment/quality-statement\" href=\"#quality-statements-lung-cancer-clinical-nurse-specialist\" class=\"fragment quality-statement\"><span><span>4</span><span>Lung cancer clinical nurse specialist</span></span></a></div><div class=\"p\"><a rel=\"/rels/view-fragment/quality-statement\" href=\"#quality-statements-palliative-interventions\" class=\"fragment quality-statement\"><span><span>15</span><span>Palliative interventions</span></span></a></div></div><div id=\"paths-lung-cancer-overview-nodes-service-organisation-fullcontent-sourceguidancereferences\" class=\"fragment sourceguidancereference \"><h1>Sources</h1><div class=\"p\">The NICE guidance that was used to create this part of the pathway. </div><div class=\"p\"><a rel=\"/rels/view-fragment/source-guidance\" href=\"#source-guidance-cg121\" class=\"fragment source-guidance\"><span>CG121</span></a></div></div></div>

",
          "geometry": {
            "-width": "176",
            "-height": "26",
            "-left": "212",
            "-top": "79"
          }
        }
      ]
    }
  }
}

*/