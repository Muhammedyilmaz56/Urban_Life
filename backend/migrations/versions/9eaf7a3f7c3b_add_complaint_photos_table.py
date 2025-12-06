"""add complaint_photos table

Revision ID: 9eaf7a3f7c3b
Revises: b65e9477dc4f
Create Date: 2025-12-03 19:26:19.328212

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



revision: str = '9eaf7a3f7c3b'
down_revision: Union[str, Sequence[str], None] = 'b65e9477dc4f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'complaint_photos',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('complaint_id', sa.Integer(), sa.ForeignKey('complaints.id'), nullable=False),
        sa.Column('photo_url', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )


def downgrade():
    op.drop_table('complaint_photos')