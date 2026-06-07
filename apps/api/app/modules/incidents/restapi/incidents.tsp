import "@typespec/http";

using Http;
model ClientRequest {
  id: string;
  name: string;
}

model ParticipantRequest {
  id: string;
  name: string;
  email: string;
}

model CreateIncidentRequest {
  title: string;
  severity: string;
  description: string;
  env: string;
  affected_clients: ClientRequest[];
  participants: ParticipantRequest[];
  affects_all_clients: bool;
}

model IncidentResponse {
  id: string;
  public_id: string;
  title: string;
  description: string;
  severity: string;
  affected_clients: ClientRequest[];
  participants: ParticipantRequest[];
  reported_date: datetime;
  created_on: datetime;
  modified_on: datetime;
}

@route("/incidents")
interface Incidents {
  list(): IncidentResponse[];
  create(@body incident: CreateIncidentRequest): IncidentResponse;
  read(@path id: string): IncidentResponse;
  update(@path id: string, @body incident: CreateIncidentRequest): IncidentResponse;
}
