import { createTool } from '@mastra/core';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { LeaveRegistryEdpService } from '../../leave-registry/leave-registry-edp.service';

@Injectable()
export class ToolMastraLeaveRegistry {
  public tool: any;
  constructor(
    private readonly leaveRegistryEdpService: LeaveRegistryEdpService
  ) {
    this.tool = createTool({
      id: 'get-leaves-registry',
      description: `
        Tool Description
A specialized tool that fetches employee absence-related events using a contract ID and generates a comprehensive event aggregate datamodel. 
The tool processes various event types from the leave management system and constructs a complete historical view of an employee's absences.
Input
jlContractId: String - The unique identifier for an employee's contract
Output
An aggregate datamodel object containing:
All leaves of the employee
Chronological history of all leave-related events (getHistory)
Current state of all leaves reconstructed from the event stream
      `,
      inputSchema: z.object({
        jlContractId: z.string().describe('The contract Id of the Employee'),
      }),
      outputSchema: z
        .object({
          leaveRegistry: z
            .object({
              getDataStore: z
                .any()
                .describe('The data store of the leave registry'),
              getHistory: z.array(
                z.object({
                  eventTime: z.number(),
                  eventType: z.string(),
                  subjectId: z.string(),
                  payload: z.any(),
                })
              ),
            })
            .describe('The leave registry aggregate, '),
        })
        .describe(
          'The aggregated datamodel interpreted as a context for the query'
        ),
      execute: async ({ context }) => {
        return await this.getLeaveRegistriesByJLContractId.bind(this)(
          context.jlContractId
        );
      },
    });
  }

  getLeaveRegistriesByJLContractId(jlContractId: string) {
    return this.leaveRegistryEdpService.getLeaveRegistriesByJLContractId(
      jlContractId
    );
  }
}
