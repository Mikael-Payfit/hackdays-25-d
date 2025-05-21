import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MappingService {
  private tableName: string;

  constructor(
    @Inject('DynamoDBDocumentClient')
    private dynamoDbClient: DynamoDBDocumentClient
  ) {
    this.tableName = 'hris-time-external-internal-mapping';
  }

  async queryAllByExternalId({
    externalId,
    externalType,
    internalType,
    uniq = true,
  }: {
    externalId: string;
    externalType?: string;
    internalType?: string;
    uniq: boolean;
  }): Promise<any[]> {
    const filterExpression: string[] = [];
    const expressionAttributeValues: Record<string, any> = {
      ':externalId': externalId,
      ':createdAt': 0,
    };

    if (externalType) {
      filterExpression.push('externalType = :externalType');
      expressionAttributeValues[':externalType'] = externalType;
    }

    if (internalType) {
      filterExpression.push('internalType = :internalType');
      expressionAttributeValues[':internalType'] = internalType;
    }

    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression:
        'externalId = :externalId AND createdAt > :createdAt',
      ExpressionAttributeValues: expressionAttributeValues,
      ...(filterExpression.length > 0 && {
        FilterExpression: filterExpression.join(' AND '),
      }),
      ScanIndexForward: false,
    });

    try {
      const response = await this.dynamoDbClient.send(command);
      let results: any[] = response.Items as any[];
      if (!results || results.length === 0) {
        return [];
      }

      if (uniq) {
        const latestEntries = new Map<string, any>();

        for (const item of results) {
          const existingEntry = latestEntries.get(item.externalId);
          if (!existingEntry || existingEntry.createdAt < item.createdAt) {
            latestEntries.set(item.externalId, item);
          }
        }

        results = Array.from(latestEntries.values());
      }

      return results;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to query all mappings by externalId: ${error.message}`
        );
      }
      throw error;
    }
  }

  async queryLastByExternalId({
    externalId,
    externalType,
    internalType,
  }: {
    externalId: string;
    externalType?: string;
    internalType?: string;
  }): Promise<any | undefined> {
    if (!externalId) {
      throw new Error('External ID is required');
    }

    const filterExpression: string[] = [];
    const expressionAttributeValues: Record<string, any> = {
      ':externalId': externalId,
      ':createdAt': 0,
    };

    if (externalType) {
      filterExpression.push('externalType = :externalType');
      expressionAttributeValues[':externalType'] = externalType;
    }

    if (internalType) {
      filterExpression.push('internalType = :internalType');
      expressionAttributeValues[':internalType'] = internalType;
    }

    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression:
        'externalId = :externalId AND createdAt > :createdAt',
      ExpressionAttributeValues: expressionAttributeValues,
      ...(filterExpression.length > 0 && {
        FilterExpression: filterExpression.join(' AND '),
      }),
      ScanIndexForward: false,
    });

    try {
      const response = await this.dynamoDbClient.send(command);
      if (!response.Items || response.Items.length === 0) {
        return undefined;
      }
      return response.Items[0] as any;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to query last mapping by externalId: ${error.message}`
        );
      }
      throw error;
    }
  }

  async queryAllByInternalId({
    internalId,
    externalType,
    internalType,
    uniq = true,
  }: {
    internalId: string;
    externalType?: string;
    internalType?: string;
    uniq: boolean;
  }): Promise<any[]> {
    if (!internalId) {
      throw new Error('Internal ID is required');
    }

    const filterExpression: string[] = [];
    const expressionAttributeValues: Record<string, any> = {
      ':internalId': internalId,
      ':createdAt': 0,
    };

    if (externalType) {
      filterExpression.push('externalType = :externalType');
      expressionAttributeValues[':externalType'] = externalType;
    }

    if (internalType) {
      filterExpression.push('internalType = :internalType');
      expressionAttributeValues[':internalType'] = internalType;
    }

    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression:
        'internalId = :internalId AND createdAt > :createdAt',
      ExpressionAttributeValues: expressionAttributeValues,
      ...(filterExpression.length > 0 && {
        FilterExpression: filterExpression.join(' AND '),
      }),
      ScanIndexForward: false,
    });

    try {
      const response = await this.dynamoDbClient.send(command);
      let results: any[] = response.Items as any[];
      if (!results || results.length === 0) {
        return [];
      }

      if (uniq) {
        const latestEntries = new Map<string, any>();

        for (const item of results) {
          const existingEntry = latestEntries.get(item.externalId);
          if (!existingEntry || existingEntry.createdAt < item.createdAt) {
            latestEntries.set(item.externalId, item);
          }
        }

        results = Array.from(latestEntries.values());
      }

      return results;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to query all mappings by internalId: ${error.message}`
        );
      }
      throw error;
    }
  }

  async queryLastByInternalId({
    internalId,
    externalType,
    internalType,
  }: {
    internalId: string;
    externalType?: string;
    internalType?: string;
  }): Promise<any | undefined> {
    const filterExpression: string[] = [];
    const expressionAttributeValues: Record<string, any> = {
      ':internalId': internalId,
      ':createdAt': 0,
    };

    if (externalType) {
      filterExpression.push('externalType = :externalType');
      expressionAttributeValues[':externalType'] = externalType;
    }

    if (internalType) {
      filterExpression.push('internalType = :internalType');
      expressionAttributeValues[':internalType'] = internalType;
    }

    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'internalId',
      KeyConditionExpression:
        'internalId = :internalId AND createdAt > :createdAt',
      ExpressionAttributeValues: expressionAttributeValues,
      ...(filterExpression.length > 0 && {
        FilterExpression: filterExpression.join(' AND '),
      }),
      ScanIndexForward: false,
    });

    try {
      const response = await this.dynamoDbClient.send(command);
      if (!response.Items || response.Items.length === 0) {
        return undefined;
      }
      return response.Items[0] as any;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to query last mapping by internalId: ${error.message}`
        );
      }
      throw error;
    }
  }
}
